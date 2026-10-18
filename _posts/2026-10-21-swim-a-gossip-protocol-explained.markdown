---
layout: post
title:  "SWIM: a gossip protocol explained through code"
description: "Explaining how cluster membership works with the SWIM protocol and a real production implementation."
tags: [distributed-systems]
date:   2026-10-21 06:00:52
comments: true
share: true
---

Over the last few years I have been learning more about distributed systems. In one of my exploration sessions, I found Corrosion [[1]](#references), a proxy service used by Fly.io. Corrosion is a gossip-based service discovery service for large distributed systems. I am familiar with service discovery applications like Consul, Eureka and Zookeeper, but I was a bit confused every time I read the term “gossip”. 

Imagine a large-scale cloud provider with hundreds of servers constantly restarting, failing, joining, and leaving a cluster. In traditional cluster monitoring systems, such as those using simple heartbeat mechanisms, every node must periodically ping every other node to check its health. For a cluster with N nodes, this results in O(n²) messages, creating significant network overhead as the cluster grows.

Previous attempts have been made to fix the quadratic increase in network load. Most of them involved making heartbeat less frequent, and relying on a centralized coordinator that has a clear picture of the entire cluster. But those attempts resulted in failure detection becoming slow or prune to single points of failure. When a node is declared dead falsely due to a temporary network failure, such a system wastes resources trying to replace a healthy node.

Membership protocols exist to solve this problem. Specifically in SWIM [[2]](#references), a paper published in 2002, the authors provide a key insight to avoid the quadratic increase in network load: it can be done by **separating failure detection operations from the membership update dissemination**.

In this post I explain how the SWIM protocol works, using [memberlist](https://github.com/hashicorp/memberlist), a real production implementation written in Go by HashiCorp.

## The SWIM protocol
Previous literature [[3]](#references) describe four properties that need to be balanced in distributed failure detector protocols: the first is strong completeness, meaning that any failure of a member is detected by all other members of the group. The second is speed of detection, the time interval between a failure and its detection by some members of the group. The third is the accuracy of its failure detection mechanism. The last is the network message load, in bytes per second, that the protocol imposes while operating.

SWIM is composed of two key components: the  **failure detector**, and the  **dissemination component** that propagates changes about nodes joining and leaving the cluster. For a detailed theoretical description of the protocol and formalities around how each component works, I recommend reading the original SWIM paper. 

In the following section I describe how SWIM is implemented in Memberlist, a production open source library written in Go.

## A real implementation in Go
Memberlist is a Go library to handle group membership and failure detection in clusters. It is used in Consul and Nomad for basic node discovery and health detection. It implements the SWIM protocol in a very readable architecture. Some of the concepts and operations described in the original paper sounded too abstract for me, so reading code helped me a lot to actually understand how things work.

> I have deliberately ommitted code from the original implementation for simplicity. Things like metrics reporting and locking were removed so we can focus on the membership-related operations.

### Failure detection

The first thing to execute is the [memberlist.go](https://github.com/hashicorp/memberlist/blob/master/memberlist.go) file, specifically the *Create* function. It calls *setAlive* and then *schedule*. The *setAlive* function initiates the very first node of the cluster:

```go
// setAlive is used to mark this node as being alive. This is the same
// as if we received an alive notification our own network channel for
func (m *Memberlist) setAlive() error {
   // Set any metadata from the delegate.
   var meta []byte

   a := alive{
       Incarnation: m.nextIncarnation(),
       Node:        m.config.Name,
       Addr:        addr,
       Port:        uint16(port),
       Meta:        meta,
       Vsn:         m.config.BuildVsnArray(),
   }
   m.aliveNode(&a, nil, true)

   return nil
}
```

Then the schedule function starts a process called *ticker*. Tickets periodically execute a probe to check the health of other nodes. The *probe* function in [state.go](https://github.com/hashicorp/memberlist/blob/master/state.go#L232) walks a list of known nodes, skipping nodes that are already dead, and shuffles that list to trigger individual probes to nodes spreading across the membership rather than always following the same order.

```go
// Tick is used to perform a single round of failure detection and gossip
func (m *Memberlist) probe() {
   // Track the number of indexes we've considered probing
   numCheck := 0
START:
   m.nodeLock.RLock()


   // Make sure we don't wrap around infinitely
   if numCheck >= len(m.nodes) {
       m.nodeLock.RUnlock()
       return
   }


   // Handle the wrap around case
   if m.probeIndex >= len(m.nodes) {
       m.nodeLock.RUnlock()
       m.resetNodes()
       m.probeIndex = 0
       numCheck++
       goto START
   }


   // Determine if we should probe this node
   skip := false
   node := *m.nodes[m.probeIndex]


   if node.Name == m.config.Name {
       skip = true
   } else if node.DeadOrLeft() {
       skip = true
   }


   // Potentially skip
   m.nodeLock.RUnlock()
   m.probeIndex++
   if skip {
       numCheck++
       goto START
   }


   // Probe the specific node
   m.probeNode(&node)
}
```

The *probeNode* function, also in [state.go](https://github.com/hashicorp/memberlist/blob/master/state.go#L305), is called at the very end of the probe function presented above. This function is responsible for individual node checks. It assigns every ping a sequence number, and sends a UDP ping to the target node. The sequence numbers are used so that the receiver can match an ack to the probe node that triggered the probing process.

If the direct UDP ping gets no reply, *probeNode* selects live peers to try probing the target on its behalf. That’s the indirect probe. A helper function receives an indirect ping request, pings the target node, then forwards it back to the original probe node.

Probes using TCP pings are also supported when enabled through configuration params, but I have omitted that from the *probeNode* function below for simplicity.

```go
// probeNode handles a single round of failure checking on a node.
func (m *Memberlist) probeNode(node *nodeState) {
   // We use our health awareness to scale the overall probe interval, so we
   // slow down if we detect problems. The ticker that calls us can handle
   // us running over the base interval, and will skip missed ticks.
   probeInterval := m.awareness.ScaleTimeout(m.config.ProbeInterval)


   // Prepare a ping message and setup an ack handler.
   selfAddr, selfPort := m.getAdvertise()
   ping := ping{
       SeqNo:      m.nextSeqNo(),
       Node:       node.Name,
       SourceAddr: selfAddr,
       SourcePort: selfPort,
       SourceNode: m.config.Name,
   }
   ackCh := make(chan ackMessage, m.config.IndirectChecks+1)
   nackCh := make(chan struct{}, m.config.IndirectChecks+1)
   m.setProbeChannels(ping.SeqNo, ackCh, nackCh, probeInterval)


   // Mark the sent time here, which should be after any pre-processing but
   // before system calls to do the actual send. This probably over-reports
   // a bit, but it's the best we can do. We had originally put this right
   // after the I/O, but that would sometimes give negative RTT measurements
   // which was not desirable.
   sent := time.Now()


   // Send a ping to the node. If this node looks like it's suspect or dead,
   // also tack on a suspect message so that it has a chance to refute as
   // soon as possible.
   deadline := sent.Add(probeInterval)
   addr := node.Address()


   // Arrange for our self-awareness to get updated.
   var awarenessDelta int
   defer func() {
       m.awareness.ApplyDelta(awarenessDelta)
   }()
   if node.State == StateAlive {
       if err := m.encodeAndSendMsg(node.FullAddress(), pingMsg, &ping); err != nil {
           m.logger.Printf("[ERR] memberlist: Failed to send UDP ping: %s", err)
           if failedRemote(err) {
               goto HANDLE_REMOTE_FAILURE
           } else {
               return
           }
       }
   } else {
       var msgs [][]byte
       if buf, err := encode(pingMsg, &ping, m.config.MsgpackUseNewTimeFormat); err != nil {
           m.logger.Printf("[ERR] memberlist: Failed to encode UDP ping message: %s", err)
           return
       } else {
           msgs = append(msgs, buf.Bytes())
       }
       s := suspect{Incarnation: node.Incarnation, Node: node.Name, From: m.config.Name}
       if buf, err := encode(suspectMsg, &s, m.config.MsgpackUseNewTimeFormat); err != nil {
           m.logger.Printf("[ERR] memberlist: Failed to encode suspect message: %s", err)
           return
       } else {
           msgs = append(msgs, buf.Bytes())
       }


       compound := makeCompoundMessage(msgs)
       if err := m.rawSendMsgPacket(node.FullAddress(), &node.Node, compound.Bytes()); err != nil {
           m.logger.Printf("[ERR] memberlist: Failed to send UDP compound ping and suspect message to %s: %s", addr, err)
           if failedRemote(err) {
               goto HANDLE_REMOTE_FAILURE
           } else {
               return
           }
       }
   }


   // Arrange for our self-awareness to get updated. At this point we've
   // sent the ping, so any return statement means the probe succeeded
   // which will improve our health until we get to the failure scenarios
   // at the end of this function, which will alter this delta variable
   // accordingly.
   awarenessDelta = -1


   // Wait for response or round-trip-time.
   select {
   case v := <-ackCh:
       if v.Complete {
           if m.config.Ping != nil {
               rtt := v.Timestamp.Sub(sent)
               m.config.Ping.NotifyPingComplete(&node.Node, rtt, v.Payload)
           }
           return
       }


       // As an edge case, if we get a timeout, we need to re-enqueue it
       // here to break out of the select below.
       if !v.Complete {
           ackCh <- v
       }
   case <-time.After(m.config.ProbeTimeout):
       // Note that we don't scale this timeout based on awareness and
       // the health score. That's because we don't really expect waiting
       // longer to help get UDP through. Since health does extend the
       // probe interval it will give the TCP fallback more time, which
       // is more active in dealing with lost packets, and it gives more
       // time to wait for indirect acks/nacks.
       m.logger.Printf("[DEBUG] memberlist: Failed UDP ping: %s (timeout reached)", node.Name)
   }


HANDLE_REMOTE_FAILURE:
   // Get some random live nodes.
   m.nodeLock.RLock()
   kNodes := kRandomNodes(m.config.IndirectChecks, m.nodes, func(n *nodeState) bool {
       return n.Name == m.config.Name ||
           n.Name == node.Name ||
           n.State != StateAlive
   })
   m.nodeLock.RUnlock()


   // Attempt an indirect ping.
   expectedNacks := 0
   selfAddr, selfPort = m.getAdvertise()
   ind := indirectPingReq{
       SeqNo:      ping.SeqNo,
       Target:     node.Addr,
       Port:       node.Port,
       Node:       node.Name,
       SourceAddr: selfAddr,
       SourcePort: selfPort,
       SourceNode: m.config.Name,
   }
   for _, peer := range kNodes {
       // We only expect nack to be sent from peers who understand
       // version 4 of the protocol.
       if ind.Nack = peer.PMax >= 4; ind.Nack {
           expectedNacks++
       }


       if err := m.encodeAndSendMsg(peer.FullAddress(), indirectPingMsg, &ind); err != nil {
           m.logger.Printf("[ERR] memberlist: Failed to send indirect UDP ping: %s", err)
       }
   }


   // Also make an attempt to contact the node directly over TCP. This
   // helps prevent confused clients who get isolated from UDP traffic
   // but can still speak TCP (which also means they can possibly report
   // misinformation to other nodes via anti-entropy), avoiding flapping in
   // the cluster.
   //
   // This is a little unusual because we will attempt a TCP ping to any
   // member who understands version 3 of the protocol, regardless of
   // which protocol version we are speaking. That's why we've included a
   // config option to turn this off if desired.
   fallbackCh := make(chan bool, 1)


   disableTcpPings := m.config.DisableTcpPings ||
       (m.config.DisableTcpPingsForNode != nil && m.config.DisableTcpPingsForNode(node.Name))
    // {} TCP-related code omitted for simplicity


   // Wait for the acks or timeout. Note that we don't check the fallback
   // channel here because we want to issue a warning below if that's the
   // *only* way we hear back from the peer, so we have to let this time
   // out first to allow the normal UDP-based acks to come in.
   v := <-ackCh
   if v.Complete {
       return
   }


   // Finally, poll the fallback channel. The timeouts are set such that
   // the channel will have something or be closed without having to wait
   // any additional time here.
   for didContact := range fallbackCh {
       if didContact {
           m.logger.Printf("[WARN] memberlist: Was able to connect to %s over TCP but UDP probes failed, network may be misconfigured", node.Name)
           return
       }
   }


   // Update our self-awareness based on the results of this failed probe.
   // If we don't have peers who will send nacks then we penalize for any
   // failed probe as a simple health metric. If we do have peers to nack
   // verify, then we can use that as a more sophisticated measure of self-
   // health because we assume them to be working, and they can help us
   // decide if the probed node was really dead or if it was something wrong
   // with ourselves.
   awarenessDelta = 0
   if expectedNacks > 0 {
       if nackCount := len(nackCh); nackCount < expectedNacks {
           awarenessDelta += (expectedNacks - nackCount)
       }
   } else {
       awarenessDelta += 1
   }


   // No acks received from target, suspect it as failed.
   m.logger.Printf("[INFO] memberlist: Suspect %s has failed, no acks received", node.Name)
   s := suspect{Incarnation: node.Incarnation, Node: node.Name, From: m.config.Name}
   m.suspectNode(&s)
}
```

If the direct or indirect probe fails, the *probeNode* function, as demonstrated above, calls *suspectNode* ([state.go](https://github.com/hashicorp/memberlist/blob/master/state.go#L1157)). The suspect report contains the node name, the incarnation number, and the reporter (from which node the suspicion was reported). If the suspicion report comes from a known, alive node, it records the state StateSuspect, rebroadcasts the report, and starts a suspicion timer.
```go
// suspectNode is invoked by the network layer when we get a message
// about a suspect node
func (m *Memberlist) suspectNode(s *suspect) {
   state, ok := m.nodeMap[s.Node]


   // If we've never heard about this node before, ignore it
   if !ok {
       return
   }


   // Ignore old incarnation numbers
   if s.Incarnation < state.Incarnation {
       return
   }


   // See if there's a suspicion timer we can confirm. If the info is new
   // to us we will go ahead and re-gossip it. This allows for multiple
   // independent confirmations to flow even when a node probes a node
   // that's already suspect.
   if timer, ok := m.nodeTimers[s.Node]; ok {
       if timer.Confirm(s.From) {
           m.encodeAndBroadcast(s.Node, suspectMsg, s)
       }
       return
   }


   // Ignore non-alive nodes
   if state.State != StateAlive {
       return
   }


   // If this is us we need to refute, otherwise re-broadcast
   if state.Name == m.config.Name {
       m.refute(state, s.Incarnation)
       m.logger.Printf("[WARN] memberlist: Refuting a suspect message (from: %s)", s.From)
       return // Do not mark ourself suspect
   } else {
       m.encodeAndBroadcast(s.Node, suspectMsg, s)
   }


   // Update the state
   state.Incarnation = s.Incarnation
   state.State = StateSuspect
   changeTime := time.Now()
   state.StateChange = changeTime


   // Setup a suspicion timer. Given that we don't have any known phase
   // relationship with our peers, we set up k such that we hit the nominal
   // timeout two probe intervals short of what we expect given the suspicion
   // multiplier.
   k := m.config.SuspicionMult - 2


   // If there aren't enough nodes to give the expected confirmations, just
   // set k to 0 to say that we don't expect any. Note we subtract 2 from n
   // here to take out ourselves and the node being probed.
   n := m.estNumNodes()
   if n-2 < k {
       k = 0
   }


   // Compute the timeouts based on the size of the cluster.
   min := suspicionTimeout(m.config.SuspicionMult, n, m.config.ProbeInterval)
   max := time.Duration(m.config.SuspicionMaxTimeoutMult) * min
   fn := func(numConfirmations int) {
       var d *dead


       m.nodeLock.Lock()
       state, ok := m.nodeMap[s.Node]
       timeout := ok && state.State == StateSuspect && state.StateChange.Equal(changeTime)
       if timeout {
           d = &dead{Incarnation: state.Incarnation, Node: state.Name, From: m.config.Name}
       }
       m.nodeLock.Unlock()


       if timeout {
           if k > 0 && numConfirmations < k {
               metrics.IncrCounterWithLabels([]string{"memberlist", "degraded", "timeout"}, 1, m.metricLabels)
           }


           m.logger.Printf("[INFO] memberlist: Marking %s as failed, suspect timeout reached (%d peer confirmations)",
               state.Name, numConfirmations)


           m.deadNode(d)
       }
   }
   m.nodeTimers[s.Node] = newSuspicion(s.From, k, min, max, fn)
}

```

The suspicion timer starts with a timeout based on cluster size and a configuration param. At each distinct peer node confirmation it shortens the timeout down to a minimum. Once enough confirmations arrive, it stops accepting suspect confirmations. If the timer expires while the node state is still suspect, it calls *deadNode*, a function that updates the state of the node setting it to dead.

When a node is accused of being dead, it can answer back to refuse the accusation by sending a new incarnation number. Then *refute* ([state.go](https://github.com/hashicorp/memberlist/blob/master/state.go#L912)) broadcasts an “alive” message. 

```go
// refute gossips an alive message in response to incoming information that we
// are suspect or dead. It will make sure the incarnation number beats the given
// accusedInc value, or you can supply 0 to just get the next incarnation number.
// This alters the node state that's passed in so this MUST be called while the
// nodeLock is held.
func (m *Memberlist) refute(me *nodeState, accusedInc uint32) {
   // Make sure the incarnation number beats the accusation.
   inc := m.nextIncarnation()
   if accusedInc >= inc {
       inc = m.skipIncarnation(accusedInc - inc + 1)
   }
   me.Incarnation = inc


   // Decrease our health because we are being asked to refute a problem.
   m.awareness.ApplyDelta(1)


   // Format and broadcast an alive message.
   a := alive{
       Incarnation: inc,
       Node:        me.Name,
       Addr:        me.Addr,
       Port:        me.Port,
       Meta:        me.Meta,
       Vsn: []uint8{
           me.PMin, me.PMax, me.PCur,
           me.DMin, me.DMax, me.DCur,
       },
   }
   m.encodeAndBroadcast(me.Addr.String(), aliveMsg, a)
}

```

This “alive” message is captured by *alivenode*, a function that clears active suspicion timers and updates the node from suspect to alive. 

Membership update messages are encoded and queued to be sent to selected peers. The *gossip* function ([state.go](https://github.com/hashicorp/memberlist/blob/master/state.go#L590)) is responsible for sending those updates to random peers according to the configured params. 

```go
// gossip is invoked every GossipInterval period to broadcast our gossip
// messages to a few random nodes.
func (m *Memberlist) gossip() {
   // Get some random live, suspect, or recently dead nodes
   kNodes := kRandomNodes(m.config.GossipNodes, m.nodes, func(n *nodeState) bool {
       if n.Name == m.config.Name {
           return true
       }


       switch n.State {
       case StateAlive, StateSuspect:
           return false


       case StateDead:
           return time.Since(n.StateChange) > m.config.GossipToTheDeadTime


       default:
           return true
       }
   })


   for _, node := range kNodes {
       // Get any pending broadcasts
       msgs := m.getBroadcasts(compoundOverhead, bytesAvail)
       if len(msgs) == 0 {
           return
       }


       addr := node.Address()
       if len(msgs) == 1 {
           // Send single message as is
           if err := m.rawSendMsgPacket(node.FullAddress(), &node, msgs[0]); err != nil {
               m.logger.Printf("[ERR] memberlist: Failed to send gossip to %s: %s", addr, err)
           }
       } else {
           // Otherwise create and send one or more compound messages
           compounds := makeCompoundMessages(msgs)
           for _, compound := range compounds {
               if err := m.rawSendMsgPacket(node.FullAddress(), &node, compound.Bytes()); err != nil {
                   m.logger.Printf("[ERR] memberlist: Failed to send gossip to %s: %s", addr, err)
               }
           }
       }
   }
}

```

With the standard default configs, Memberlist has a probe interval of 1 second, with a probe timeout of 500 ms, and three peers are used for indirect checks.

### Dissemination component

We already covered some basics of how changes are disseminated through the cluster when we described the gossip function. But it’s worth providing details on how gossip actually happens disseminating messages through the cluster.

When a node state changes, *aliveNode, suspectNode or deadNode* functions are called. They call *encodeAndBroadcast*, which adds the "update" message to the transmission queue. If there are multiple updates for the same node, newer messages can suppress earlier ones. A newer “alive” message can suppress an old “suspect” one, for example.

The *handleCommand* function ([net.go](https://github.com/hashicorp/memberlist/blob/master/net.go#L435)) routes every membership update message to the correct packet handler, which updates the state accordingly. Those functions validate state updates, then enqueue it as messages to continue the gossip. This is how a message travels the cluster through multiple hops.

```go
func (m *Memberlist) handleCommand(buf []byte, from net.Addr, timestamp time.Time) {
   // Decode the message type
   msgType := messageType(buf[0])
   buf = buf[1:]


   // Switch on the msgType
   switch msgType {
   case compoundMsg:
       m.handleCompound(buf, from, timestamp)
   case compressMsg:
       m.handleCompressed(buf, from, timestamp)


   case pingMsg:
       m.handlePing(buf, from)
   case indirectPingMsg:
       m.handleIndirectPing(buf, from)
   case ackRespMsg:
       m.handleAck(buf, from, timestamp)
   case nackRespMsg:
       m.handleNack(buf, from)


   case suspectMsg:
       fallthrough
   case aliveMsg:
       fallthrough
   case deadMsg:
       fallthrough
   case userMsg:
       // Determine the message queue, prioritize alive
       queue := m.lowPriorityMsgQueue
       if msgType == aliveMsg {
           queue = m.highPriorityMsgQueue
       }


       // Check for overflow and append if not full
       m.msgQueueLock.Lock()
       if queue.Len() >= m.config.HandoffQueueDepth {
           m.logger.Printf("[WARN] memberlist: handler queue full, dropping message (%d) %s", msgType, LogAddress(from))
       } else {
           queue.PushBack(msgHandoff{msgType, buf, from})
       }
       m.msgQueueLock.Unlock()


       // Notify of pending message
       select {
       case m.handoffCh <- struct{}{}:
       default:
       }


   default:
       m.logger.Printf("[ERR] memberlist: msg type (%d) not supported %s", msgType, LogAddress(from))
   }
}

```

The *packetHandler* ([net.go](https://github.com/hashicorp/memberlist/blob/master/net.go#L513)) drains the queue filled with membership updates by the above demonstrated code, calling the appropriate membership handler for each update. Inside the *packetHandler* a function named *getNextMessage* is called selecting the high priority queue first, prioritizing the “alive” messages.

```go
// packetHandler is a long running goroutine that processes messages received
// over the packet interface, but is decoupled from the listener to avoid
// blocking the listener which may cause ping/ack messages to be delayed.
func (m *Memberlist) packetHandler() {
   for {
       select {
       case <-m.handoffCh:
           for {
               msg, ok := m.getNextMessage()
               if !ok {
                   break
               }
               msgType := msg.msgType
               buf := msg.buf
               from := msg.from


               switch msgType {
               case suspectMsg:
                   m.handleSuspect(buf, from)
               case aliveMsg:
                   m.handleAlive(buf, from)
               case deadMsg:
                   m.handleDead(buf, from)
               case userMsg:
                   m.handleUser(buf, from)
               default:
                   m.logger.Printf("[ERR] memberlist: Message type (%d) not supported %s (packet handler)", msgType, LogAddress(from))
               }
           }


       case <-m.shutdownCh:
           return
       }
   }
}

```

Finally, there is a periodic task to exchange the complete membership view of the cluster with peer nodes. It works as a catch-up for when a node missed gossip messages for some reason (network failures, temporary hiccups, etc). This is done by the *pushPull* function ([state.go](https://github.com/hashicorp/memberlist/blob/master/state.go#L648)):

```go
// pushPull is invoked periodically to randomly perform a complete state
// exchange. Used to ensure a high level of convergence, but is also
// reasonably expensive as the entire state of this node is exchanged
// with the other node.
func (m *Memberlist) pushPull() {
   // Get a random live node
   nodes := kRandomNodes(1, m.nodes, func(n *nodeState) bool {
       return n.Name == m.config.Name ||
           n.State != StateAlive
   })


   // If no nodes, bail
   if len(nodes) == 0 {
       return
   }
   node := nodes[0]


   // Attempt a push pull
   if err := m.pushPullNode(node.FullAddress(), false); err != nil {
       m.logger.Printf("[ERR] memberlist: Push/Pull with %s failed: %s", node.Name, err)
   }
}

```

## Visualizing the process

I used Codex to generate interactive animations showing the two main operations described in the above sections: failure detection and membership updates. The animation style is heavily inspired by [Sam Rose's beautiful interactive essays about software](https://samwho.dev/).

### Failure detection

The first animation demonstrates a direct ping, indirect checks through three helper nodes, and the transition from suspicion to dead when acknowledgment doesn't arrive. The animation shows how an indirect probe can prevent false failures.

<swim-animation kind="failure"></swim-animation>

### Membership updates

The second animation shows the membership update spreading cross the cluser. Using the menu, you can compare the scenarios seeing how a new member gets added, a failure update is pread, or a newer incarnation number is generate to refute suspicion.

<swim-animation kind="membership"></swim-animation>

<script src="{{ '/assets/swim.js' | relative_url }}" defer></script>

## My learning process and final notes

I've always liked reading open source code to understand how things work. A friend once introduced me to the book [The Architecture of Open Source Applications](https://aosabook.org/en/), and I was fascinated to discover some of the internals of CMake, Mercurial, and Eclipse. I've been using AI a lot to explore large codebases that I'm not familiar with, and that's what I did to learn how Memberlist implements SWIM. I cloned the repo and asked Codex to show me where I could find the implementation of the two main components of SWIM: failure detection and membership dissemination. Once I had the list of files and function names, I started navigating the files and reading the code myself. From there, I started having more questions and kept iterating, asking about things I couldn't find on my own.

I'm learning that AI is a great companion for exploration sessions, but it does not remove the need to actually read code to understand how things work. When explaining code, it sometimes omits details that you might find really interesting if you read the actual lines of code. One example is the amount of critical section control in Memberlist. To prevent race conditions and deal with the reality of highly concurrent execution, they wrap many state changes and message exchange operations in lock/unlock blocks. They opt for granular, localized locks rather than a global exclusion mechanism that could become a bottleneck for the entire system. Still, I was surprised to see this. It gives you some perspective on the kinds of things you need to take into account when working with large-scale distributed systems.

It's crazy that this has to be said, but I do not use AI to write. I think it is disrespectful to readers, and it completely removes the point of writing, which, for me, is to organize my thoughts around a subject. If you have ever considered using AI for writing, I highly discourage you from doing so. People might not say it to your face, but they notice you're using AI and will avoid reading your stuff in the future. Read this survey on [how developers react to AI-scented blog posts](https://writethatblog.substack.com/p/dev-reaction-to-ai-blog-posts).

I found some extra material online that may be worth checking out if you're curious about SWIM. The first is a talk from 2019 presenting how SWIM is used in Consul [[4]](#references). The second is Lifeguard [[5]](#references), a paper describing the extensions the HashiCorp team made to SWIM in Memberlist and the motivation behind them. I also enjoyed the talk that Armon gave at a Papers We Love meetup [[6]](#references), where he presented the original SWIM paper.

## References {#references}

[1] Fast Eventual Consistency: inside Corrosion, the Distributed System Powering Fly.io, by Somtochi Onyekwere. [https://www.infoq.com/presentations/corrosion/](https://www.infoq.com/presentations/corrosion/)

[2] SWIM: Scalable Weakly-consistent Infection-style Process Group Membership Protocol. Abhinandan Das, Indranil Gupta, and Ashish Motivala. [https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf)

[3] A gossip-style failure detection service. Paper by Robbert van Renesse, Yaron Minsky, and Mark Hayden. 2009. [https://dl.acm.org/doi/abs/10.5555/1659232.1659238](https://dl.acm.org/doi/abs/10.5555/1659232.1659238)

[4] Everybody Talks: Gossip, Serf, memberlist, Raft, and SWIM in HashiCorp Consul, by Sarah Christoff. [https://www.hashicorp.com/en/resources/everybody-talks-gossip-serf-memberlist-raft-swim-hashicorp-consul](https://www.hashicorp.com/en/resources/everybody-talks-gossip-serf-memberlist-raft-swim-hashicorp-consul)

[5] "Lifeguard: Local Health Awareness for More Accurate Failure Detection", by Armon Dadgar, James Phillips, and Jon Currey. [https://arxiv.org/abs/1707.00788](https://arxiv.org/abs/1707.00788)

[6] Talk by Armon from HashiCorp. Still can’t believe they have been acquired by IBM. 💔 [https://youtu.be/bkmbWsDz8LM?si=9VKgB7v7QJjdOeUz](https://youtu.be/bkmbWsDz8LM?si=9VKgB7v7QJjdOeUz)
