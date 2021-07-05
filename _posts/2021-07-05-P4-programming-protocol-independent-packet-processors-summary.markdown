---
layout: post
title:  "P4: Programming Protocol-Independent Packet Processors"
description: "Programming language designed for protocol and target independence allowing programmers to define packet processors in SDN environments."
date:   2021-07-05 20:40:00
tags: [networking, paper-summary]   
comments: true
share: true
---

> Original article by Pat Bosshart, Dan Daly, Glen Gibb, Martin Izzard, Nick McKeown, Jennifer Rexford, Cole Schlesinger, Dan Talayco, Amin Vahdat, George Varghese, David Walker: [https://www.cs.princeton.edu/~dpw/papers/P4-CCR.pdf](https://www.cs.princeton.edu/~dpw/papers/P4-CCR.pdf)

The *de facto* SDN protocol OpenFlow is constantly evolving. Its set of protocol headers has grown from 12 to 41 fields in a few years carrying a significant complexity addition. This paper presents a high-level language for programming protocol-independent packet processors, aiming to increase current controller to data plane communication flexibility: P4.

P4 is designed for reconfigurability, protocol independence, and target independence, meaning that the controller is able to redefine the packet parsing, the switch is not tied to specific packet formats and thus the controller programmer does not need to know the switch underlying details (he can write target-independent programs).

To demonstrate how P4 works, the paper presents an example of an L2 network deployment with switches at the edge connected by a two-tier core. As the number of end-hosts grows, the core L2 tables are overflowing. This so-called mTag toy example demonstrates that P4 provides a comprehensive vocabulary for programmers to express a custom solution with minimal changes in the network architecture to solve this problem.

Some proposals of abstract forwarding models for OpenFlow include Kangaroo, which also provided the notion of programmable parsing, and Song, proposing protocol-oblivious forwarding toward network processors. Different from most of these related works, P4 proposes a language for defining the parser, tables, and control flow.

This work demonstrates that P4 can express how packets should be processed to best meet the control applications' needs. Providing a compiler that transforms an imperative program into a table dependency graph that can be mapped to any specific targets/switches, P4 provides a great contribution also to future OpenFlow releases discussions, striving for greater flexibility and unlocking the full potential of software-defined networks.

