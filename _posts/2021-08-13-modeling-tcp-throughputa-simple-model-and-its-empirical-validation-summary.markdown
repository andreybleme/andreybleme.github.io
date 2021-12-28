---
layout: post
title:  "Modeling TCP Throughput: A Simple Model and its Empirical Validation"
description: "Summary of the paper published in 1998 describing a TCP throughput prediction model that take timeouts into account."
date:   2021-08-13 22:00:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original paper by Jitendra Padhye, Victor Firoiu, Don Towsley and Jim Kurose: [https://dl.acm.org/doi/10.1145/285243.285291](https://dl.acm.org/doi/10.1145/285243.285291)

The paper presents TCP Reno, the TCP implementation that considers the effect of the TCP timeouts mechanism on throughput predictions. 

The proposed model is accurate to predict TCP throughput over loss rates by adjusting the window size (w), which is incremented at each ACK received. The package transfer window is decreased though when a package loss is detected. This algorithm is represented along with the paper as a function of loss rate.

When comparing the proposed model with real-world TCP connections, the authors conclude that the model is properly able to account for timeout impacts that are not taken into account in previous throughput prediction models.

Future work on TCP over slow links is mentioned as an interesting venue for further experimentation and analysis, along with improvements in the model to account for the effects of fast recovery and fast retransmit mechanisms from TCP.  
