---
layout: post
title:  "Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing"
description: "Summary of the paper published by University of California Berkeley researches, presenting RDD, a distributed memory abstraction for computations on large clusters."
date:   2021-11-25 22:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Matei Zaharia, Mosharaf Chowdhury, Tathagata Das, Ankur Dave, Justin Ma, Murphy McCauley, Michael J. Franklin, Scott Shenker and Ion Stoica: [https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf](https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf)

This paper presents RDD, a fault-tolerant abstraction for distributed memory that allows programmers to process large datasets in memory on big clusters. The model emerges having as its main motivation the performance problem existent in previous solutions when its computational model requires frequent reuse of results from previously executed processes, a common aspect in PageRank and K-means calculation models, for example.

 With a memory sharing model, RDDs are able to recover from failures thanks to its data mutation model that, at each iteration in an RDD, registers in a graph its dependencies which can be restored thus only RDDs disconnected from others whenever a failure happens. This avoids the high waste of redundant storage usually existent to provide high availability. The article presents benchmarks comparing the performance of Spark and Hadoop, where Spark with RDDs was able to process specific tasks being up to 20x faster even in scenarios where purposeful failures were inserted in 1 node of the Spark worker cluster.
