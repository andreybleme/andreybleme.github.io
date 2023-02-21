---
layout: post
title:  "Re-evaluating Measurement Algorithms in Software"
description: "This paper demonstrates that simple hash tables are often more efficient than sketch and heap-based solutions for measurement algorithms used in network monitoring."
date:   2023-02-20 11:00:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original paper published by Omid Alipourfard, Masoud Moshref and Minlan Y from University of Southern California: [https://dl.acm.org/doi/10.1145/2834050.2834064](https://dl.acm.org/doi/10.1145/2834050.2834064)

With more and more network functions being implemented as software, measurement has become critical to enable operators understanding network usage, detect anomalies and produce feedback to perform load balancing, control decisions, and other traffic engineering tasks. While most of the previous research on measurement algorithms focus on reducing the memory usage, this paper re-evaluate these algorithms and present the tradeoffs of accuracy and performance.

The main contribution of this paper is the demonstration of the effectiveness of simple hash tables over complex data structures. To detect heavy hitters for example, we often see sketch-based, heap-based, and sampling-based solutions, and here the authors show that, because multicore servers have significantly increased their cache size and cache efficiency recently, simple hash tables are more efficient.

To evaluate the different algorithms, the authors conducted a heavy hitter detection experiment by sending 40 million packets with a 10 G NIC to a Xeon processor with 10 cores, 256 KB L2 cache per core, 25 MB shared L3 cache, and 32 GB memory. Results prove that with higher skews there are too many updates at the heap leaves, and sketches computes 3 hash functions per packet and accesses 3 random memory locations, causing them to have worse performance (throughput, delay, and in some cases, precision) than the simple hash table.

The paper provides significant contribution by highlighting scenarios where a simple data structure such as a hash table can be efficient for a variety of measurement applications. The work is also especially complete on proposing potential solutions to handle throughput issues when hash tables has to handle measurement for uniform/non-skewed workloads. I would say this is a must read for anyone implementing measurement algorithms or managing state of multiple kinds for NFVs.