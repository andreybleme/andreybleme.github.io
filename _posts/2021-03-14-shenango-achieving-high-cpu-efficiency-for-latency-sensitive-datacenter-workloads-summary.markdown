---
layout: post
title:  "Shenango: Achieving High CPU Efficiency for Latency-sensitive Datacenter Workloads"
description: "This paper presents Shenango, a system that provides microsecond-scale tail latencies while enabling unused CPU cycles to be used by latency-sensitive batch processing applications."
date:   2021-03-14 20:15:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper and OSDI presentation by Amy Ousterhout, Joshua Fried, Jonathan Behrens, Adam Belay, and Hari Balakrishnan: [https://www.usenix.org/conference/nsdi19/presentation/ousterhout](https://www.usenix.org/conference/nsdi19/presentation/ousterhout)

This work focuses on presenting a new system for allocating new cores in a microseconds time scale while efficiently using CPU between applications that require low latency processing.

Shenango achieves comparable latencies at great CPU efficiency. It reallocates cores across applications at very fine granularity (every 5 ms) enabling cycles unused by latency-sensitive applications to be used productively by batch processing applications. This is possible thanks to its compute congestion detection algorithm, and the IOKernel, a dedicated component that steers packets from the NIC and orchestrates core reallocations.

To evaluate Shenango efficiency, the authors perform an experiment generating workloads from 6 client machines to send burst requests to a Shenango server connected through a Mellanox SX1024 switch. Latency and CPU efficiency was compared to Arachne, ZygOS, and Linux.

The results demonstrate that Shenango can sustain a 37 ms response time while handling a 5 million requests per second workload, providing high network throughput on machines handling multiple latency-sensitive and batch processing applications.
