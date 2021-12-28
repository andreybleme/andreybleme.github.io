---
layout: post
title:  "TCP Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery Algorithms"
description: "Summary of the RFC 2001, discussing the TCP mechanisms to handle package transmissions during network congestion."
date:   2021-08-11 23:40:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original RFC: [https://datatracker.ietf.org/doc/html/rfc2001](https://datatracker.ietf.org/doc/html/rfc2001)

The RFC 2001 presents the solutions for TCP implementations across the Internet to handle package transmissions. The first is the Slow Start, the algorithm that runs observing that the rate at which new packets should be injected into the network is the rate at which the ACKs are returned by the other network end.

The Slow Start algorithm works in conjunction with the Congestion Avoidance solution. Both algorithms are different and independent though, meaning that when congestion occurs at the network, TCP slowdowns its packet transmission rate and then invokes a slow start to get things working back again.

The Fast Retransmission idea is also described as a strategy for retransmitting a TCP segment after 3 consecutive duplicated acknowledgments (ACKs). This solution works together with Fast Recovery, which halves the congestion window whenever 3 consecutive ACK delays are received.

Fast Recovery and Fast Retransmission prevent the Slow Start to execute and aims to keep the network in a non-congested state.
