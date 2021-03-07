---
layout: post
title:  "IX: A Protected Dataplane Operating System for High Throughput and Low Latency"
description: "This paper demonstrates the design and implementation of an OS that provides high throughput and low latency for packet processing while still maintaining the key advantage of strong protection offered by kernels."
date:   2021-03-07 14:05:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper and OSDI presentation by Adam Belay, George Prekas, Ana Klimovic, Samuel Grossman, Christos Kozyrakis and Edouard Bugnion: [https://www.usenix.org/conference/osdi14/technical-sessions/presentation/belay](https://www.usenix.org/conference/osdi14/technical-sessions/presentation/belay)

Providing high I/O performance while maintaining the strong protection advantages offered by existing kernels is an open challenge. This paper presents IX, an operating system that relies on zero-copy APIs to optimize latency and eliminate coherence traffic by avoiding the need for multicore synchronization.

The main idea behind IX is to separate the control plane, which is responsible for resource provisioning between applications, from the data plane, which runs the network stack polling packets from the NIC. IX uses run to complete in all load conditions, using a zero-copy API that removes the need for intermediary buffering between the application logic and the network stack. The system provides flow-consistent hashing of incoming traffic to distinct hardware queues, grouping RSS flow groups into the same core eliminating the need for sync between different cores.

The IX system demonstrated to be more efficient when compared to the Linux kernel and mTCP, scaling more aggressively and needing only 3 cores to saturate a 10GbE link whereas mTCP and Linux required 8 cores. The experiments were executed using a cluster with 24 clients and one server, where most data from scalability, throughput and latency were analyzed.

Hardware virtualization through Intel VT-x hardware is an incorporated idea in IX to run the dataplane kernel and the application at distinct protection levels isolating the control plane from the dataplane, as demonstrated at Dune, a related work that provides for applications access to privileged hardware. The zero-copy communication API in IX is similar to the TinyOS scheme of passing pointers to packet buffers between the network stack and the application in an efficient way.

IX outperforms Linux and mTCP in terms of latency and throughput, being competent in leveraging hardware virtualization to isolate the Linux control plane. This work provides exceptional contribution in demonstrating many different ideas being implemented in a single operating system that provides an attractive tradeoff balance between high throughput, low latency, strong protection, and resource efficiency.
