---
layout: post
title:  "BPFabric: Data Plane Programmability for Software-Defined Networks"
description: "Paper published at IEEE Xplore presenting a new protocol for allowing increased programmability for software-defined networks data plane."
date:   2021-05-06 22:40:00
tags: [networking, paper-summary]
comments: true
share: true
---

> Original article by Simon Jouet and Dimitrios P. Pezaros: [https://ieeexplore.ieee.org/document/7966898](https://ieeexplore.ieee.org/document/7966898)

This paper presents BPFabric, a platform, protocol, and language-independent architecture to programming the control place in the context of a software-defined network. Being OpenFlow the most popular SDN implementation, the authors argue that it has significant limitations, meaning that it does not allow the implementation of more complex tasks such as middle-box-like functions for load balancing, anomaly detection, or protocol offloading.

To allow more flexibility at the data plane, BPFabric allows the usage of arbitrary functions to be compiled into eBPF instruction sets so it can capture real-time packet flow from the network switches. A southbound API allows central orchestration in the controller for management, and monitoring of the network behavior as data place functions are executed at runtime.

To demonstrate BPFabric efficiency, the paper presents two sample implementations: an L2 learning switch and a network telemetry system. Both demonstrate the flexibility of BPFabrc on allowing the implementation of middleboxes as part of the switching fabric through packet processing pipelines defined using eBPF.

Having the increasing trend on the paradigm of programmable networks through out-of-band controller-centric approaches, related works such as Intel's Flexpipe, Reconfigurable Match Tables (RMT), and POF are presented as solutions that also aimed to provide higher flexibility and better performance than the de facto SDN alternative OpenFlow. None of them relies on a protocol-independent instruction set such as BPFabric.

The limited programmability of the OpenFlow model is demonstrated to be overcome with BPFabric. Processing logic can be now implemented through the packet pipelines, allowing new possibilities with better performance results as demonstrated by the sample applications.
