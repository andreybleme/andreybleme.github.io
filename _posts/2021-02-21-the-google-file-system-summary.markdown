---
layout: post
title:  "The Google File System"
description: "This paper presents GSF, the scalable distributed file system implemented at Google to support data-intensive applications with fault tolerance mechanisms and high aggregate performance to a large number of clients."
date:   2021-02-21 86:00:00
tags: [operating systems, paper summary]
comments: true
share: true
---

> Original paper by Sanjay Ghemawat, Howard Gobioff, and Shun-Tak Leung: [https://static.googleusercontent.com/media/research.google.com/pt-BR//archive/gfs-sosp2003.pdf](https://static.googleusercontent.com/media/research.google.com/pt-BR//archive/gfs-sosp2003.pdf)

When building a distributed file system there are many concerns to take into consideration: components failures (disk, memory, networking, power supply, and so on), concurrent file operations, bandwidth, latency, and many others. This paper presents the scalable, distributed file system built for meeting Google's storage needs: GFS. Despite sharing some of the same goals of previous distributed file systems, GFS is designed with the assumption that components will fail, files are huge by default (multi-GB files are common), and that most files can be mutated by appending new data rather than overwriting existing data.

Based on these assumptions the Google File System architecture consists of a single master node and multiple chunk servers that stores the chunks of files in its local disks. The multiple clients of GSF interact only with the master node, which stores only the metadata related to the requested files and responds to clients which chunk servers the client should contact. This separation between write control and data flow reduces the chances of creating a system bottleneck in the master node and eliminates the necessity of synchronizing the master node with the chunk servers simplifying the overall system design.

To evaluate the performance of GFS, the authors executed micro-benchmarks on a cluster with one master, 16 chunk servers, and 16 clients. These benchmarks helped the authors to detect slow write operations and check how the system behaved with concurrent record append operations. The paper also demonstrates the GFS performance in a real-world google cluster, demonstrating the aggregate throughput showing graphs with read, write and append operation rate compared with the network bandwidth limits imposed by the cluster topology.

Some of the related work already proposed some ideas to increase fault tolerance in distributed file systems, but they differ from GFS mainly regarding the caching strategy (which GFS doesn't use at all)  and the centralized approach for controlling chuck placement and replication policies. 

The paper offers a great contribution by describing how GFS supports large-scale data processing workloads implementing techniques for data replication, data corruption detection, and high aggregate data throughput separating file system control from data transfer. This system is an essential component of Google's overall platform and the lessons learned can be definitely applied by others who aim to implement distributed file systems.
