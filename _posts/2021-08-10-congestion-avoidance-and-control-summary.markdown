---
layout: post
title:  "Congestion avoidance and control"
description: "Paper presenting an efficient algorithm for network congestion avoidance and control, as a response to the first Internet congestion collapses that happened back in 1986."
date:   2021-08-10 23:40:00
tags: [networking, paper-summary]   
comments: true
share: true
---

> Original article by Van Jacobson and Michael J. Karels: [https://dl.acm.org/doi/10.1145/52324.52356](https://dl.acm.org/doi/10.1145/52324.52356)

This paper presents an efficient algorithm to control network congestion during packet transmission. It describes its solution for avoiding congestions collapses by taking leverage of the slow start principle from the TCP protocol.

The authors propose an algorithm simple enough to require only a few lines of code, aiming to control the so-called congestion window time. The proposed algorithm promotes the retry of failed packet transmissions optimizing for high throughput.

During the experiments conducted to evaluate the solution, simultaneous TCP conversations happened to exchange more them 8000 TCP packets, from which only 89 had to be retried. The results show a reduction of packets retries from 40% to 1%, meaning almost a doubled throughput capacity.

The work provides a great contribution to describing how the algorithm works and its evaluation with rich graphs and benchmarks against different congestion control and avoidance scenarios such as multiple, simultaneous TCPs with and without congestion avoidance, and total bandwidth used by old and new TCPs.
