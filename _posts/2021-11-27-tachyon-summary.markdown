---
layout: post
title:  "Tachyon: Reliable, Memory Speed Storage for Cluster Computing Frameworks"
description: "Summary of the paper presenting Tachyon, the distributed file system that enables reliable data sharing at memory speed."
date:   2021-11-27 18:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Haoyuan Li, Ali Ghodsi, Matei Zaharia, Scott Shenker and Ion Stoica: [https://people.csail.mit.edu/matei/papers/2014/socc_tachyon.pdf](https://people.csail.mit.edu/matei/papers/2014/socc_tachyon.pdf)

The article presents Tachyon, a reliable distributed file system that provides high throughput and low latency for read and write operations. Unlike previous proposals, Tachyon allows files to be stored in memory instead of on disk, having also a failure recovery mechanism that does not require redundant writing. This is achieved through the so-called lineage, which holds a graph of dataset changed states stored at each step of the execution process.

Using a cluster of machines on AWS EC2 with 240GB memory for each node, the authors ran experiments to examine the performance of Tachyon with Spark comparing it to Hadoop with MemHDFs, the HDFS version that also provides in-memory reads and writes. The results show that Tachyon is able to write data up to 110x faster, finishing up to 4.8x faster even in scenarios where the authors introduced failures in the cluster during processing.

Previous works like RAMCloud, FDS, HBase, and GFS have serious constraints regarding the supported throughput for data writing operations, while Tachyon, thanks to its implementation of asynchronous checkpoints, is able to be fault-tolerant without creating bottlenecks in write operations.

This paper presents important progress compared to previous ones that propose solutions for large-scale data storage applied in parallel processing in large clusters. The authors emphasize that the Tachyon system needs to be improved to better support CPU and network intense processes, but throughout the article, it is clear that the system is an effective alternative to process deterministic tasks compatible with immutable datasets.
