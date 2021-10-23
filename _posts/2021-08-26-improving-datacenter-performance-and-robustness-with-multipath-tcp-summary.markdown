---
layout: post
title:  "Improving Datacenter Performance and Robustness with Multipath TCP"
description: "Paper presenting the MPTCP protocol which improves the performance on datacenters, providing an alternative for single-path transport."
date:   2021-08-26 23:59:00
tags: [networking, paper-summary]
comments: true
share: true
---

> Original paper by Costin Raiciu, Sebastien Barre, Christopher Pluntke, Adam Greenhalgh†, Damon Wischik and Mark Handley: [http://vincen.tl/cis700sp17/mptcp-sigcomm11.pdf](http://vincen.tl/cis700sp17/mptcp-sigcomm11.pdf)

Single path transport can be ill-suited for networks containing multiple paths in their core. This paper presents Multipath TCP, a TCP replacement that improves throughput and better fairness on different datacenter topologies.

MPTPC's main idea is to extend TCP so that a single connection can be stripped across multiple network paths. The algorithm makes the congestion window increase depending on the total window size of the flow, meaning that subflows with large windows increase faster than subflows with small windows. This makes more traffic from congested paths move to less congested ones, load balancing the network.

Using a small EC2 Linux cluster, the authors ran experiments comparing TCP and MPTCP in a FatTree topology with 128 nodes and 8192 nodes. 

The results show that MPTCP improves datacenter performance by performing short timescale distributed load balancing. Using parallel paths MPTCP provides better performance in scenarios where the network bottleneck is at the core rather than on hosts or its access links.

