---
layout: post
title:  "Efficient virtual network isolation in multi-tenant data centers on commodity ethernet switches"
description: "This paper presents LANES, a system that provides network isolation for multi-tenant data center environments."
date:   2021-07-14 22:40:00
tags: [networking, paper-summary]   
comments: true
share: true
---

> Original article by Heitor Moraes, Marcos A. M. Vieira, Italo Cunha and Dorgival Guedes: [https://homepages.dcc.ufmg.br/~cunha/papers/moraes16networking-lanes.pdf](https://homepages.dcc.ufmg.br/~cunha/papers/moraes16networking-lanes.pdf)

Cloud and infrastructure vendors are constantly striving to provide efficient traffic isolation between multiple tenants in a datacenter environment. Many of the currently offered solutions suffer from limited scalability, encapsulation overheads, or required advanced hardware switches.

LANES is the presented solution that virtualizes network address spaces and isolates virtual networks using packets rewriting. It runs a virtual switch (Open vSwitch) on top of every server hosting a VM to intercept packets before they are forwarded.

To evaluate LANES, a topology with three virtualization servers connected to two switches was created in order to test LANES' isolation properties, flow establishment latency, forwarding bandwidth, and load overhead. The system presented an overhead higher than other network configuration stacks to handle OpenFlow messages, despite providing better scalability and flexibility.

Some related work aiming to provide network isolation such as Q-in-Q makes use of VLAN tags or uses encapsulation, which increases packet sizes and may also cause fragmentation. Netlord for example does not allow direct communication between different virtual networks.

Requiring no modification to hosted VMs, LANES provide network isolation with a solution that works on top of simple commodity Ethernet switches. The system provides these benefits at the cost of memory utilization on infrastructure servers and increased latencies during flow setup. It achieves, overall, a performance similar to that of simpler solutions after its flow rules are installed.
