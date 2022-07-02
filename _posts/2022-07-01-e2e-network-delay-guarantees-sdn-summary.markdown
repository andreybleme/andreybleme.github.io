---
layout: post
title:  "End-to-End Network Delay Guarantees for Real-Time Systems Using SDN"
description: "This paper demonstrates how it is possible to support critical network flows for Real-Time Systems in a Software Defined Network."
date:   2022-07-01 23:59:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original paper by Rakesh Kumar, Monowar Hasan, Smruti Padhy, Konstantin Evchenko, Lavanya Piramanayagamk, Sibin Mohan and Rakesh B. Bobban: [https://arxiv.org/pdf/1703.01641.pdf]https://arxiv.org/pdf/1703.01641.pdf)

Safety-critical systems that have to rely on a network mostly require an exclusively dedicated network, designed for supporting a deterministic and very specific RTS use case. AFDX and CAN are examples of proprietary, complex, expensive, custom hardware to support this. None of these solutions support sharing resources very well, which means, handling critical flows (with required delay guarantees) and non-critical flows at the same time.

To address this problem, this paper presents a solution based on a Software Defined Network capable of finding a path through the network that meets a given delay and bandwidth requirement. This is done through a variation of the well-known NP-Complete Multi Constrained Path algorithm.

After generating 14,000 different network topologies for multiple delay-bandwidth requirements, the experiment results show that for delay requirements stricter than 330 microseconds, there's a small number of schedulable flows. From 330 microseconds to 1ms though, most of the flows are perfectly schedulable (more than 80%). The effectiveness of the delay guarantees is also proven by an experiment showing that, even when there are 1 to 3 non-critical flows mixed with critical flows, the observed delay is not affected. 

The presented work shows that hard real-time systems can have their delay and bandwidth guarantees supported by a cost-effective and flexible network. The proliferation of commercial-off-the-shelf (COTS) switches could also benefit real-time systems, now that there is an effective solution to schedule critical flows based on a software-defined network.

> I have presented a seminar on this paper. You can check the [slides on my speaker deck](https://speakerdeck.com/andreybleme/end-to-end-network-delay-guarantees-for-real-time-systems-using-sdn).
