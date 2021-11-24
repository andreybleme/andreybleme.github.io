---
layout: post
title:  "HDFS scalability: the limits to growth"
description: "Summary of Shvachko's article presenting Hadoop distributed file system HDFS and its scalability limitations."
date:   2021-11-21 14:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original article by Konstantin V. Shvachko: [https://www.usenix.org/legacy/publications/login/2010-04/openpdfs/shvachko.pdf](https://www.usenix.org/legacy/publications/login/2010-04/openpdfs/shvachko.pdf)

The article briefly introduces how Apache Hadoop, the open-source implementation of the MapReduce model heavily inspired by two articles published by Google engineers in 2003 (GFS) and 2004 (MapReduce), wors. The focus of this work however is on the performance and storage capacity analysis of its distributed file system DHFS in the single-node namespace server architectural model, which dedicates only one node to the name server. This server stores the exact location of the data blocks located and replicated in the data nodes.

This work provides a great contribution to demonstrating how DHFS scales as the number of clients using its single namespace server increases. As with other distributed systems, Apache Hadoop users are also likely to assume that the system increases its throughput capacity linearly: as more worker nodes are added, tasks are processed at the same rate. The author demonstrates though, that a Hadoop cluster with 10 thousand clients can saturate the processing capacity of the name-node, being inefficient to add new workers for write operations from this point on. To get to this conclusion, experiments are presented measuring the maximum throughput supported for read and write operations, as well as the percentage of computational capacity consumed by the orchestration and redundancy mechanisms existing in Hadoop, the so-called block reports, and heartbeats.
