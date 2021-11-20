---
layout: post
title:  "MapReduce: Simplified Data Processing on Large Clusters"
description: "Paper from Google engineers presenting MapReduce, a model providing a robust yet simples interface for processing large datasets in distributed environments."
date:   2021-11-20 12:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper Jeffrey Dean and Sanjay Ghemawat: [https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)

When processing large datasets, the computation is ideally distributed among hundreds or thousands of machines to finish in a reasonable amount of time. This approach however brings new challenges such as: how to parallelize the computation, how to properly distribute the data, and how to handle failures that can happen across clusters?

MapReduce is presented as a model created to address these issues, as a reaction to this complexity. Providing a relatively simple programming interface, MapReduce enables automatic parallelization and distribution of large-scale computation by proposing a simple programming workflow that consists of sequential yet flexible steps.

To evaluate MapReduce the authors desmonstrate two task executions running in a cluster with 1800 machines. The MapReduce computation process is demonstrated to have peaked at over 30GB/s for one task and 13GB/s for the other, having finished its entire execution on 150 seconds for the first and 600 seconds for the second task.

Some of the previous known proposals to address these challenges are mostly not focused on large scale processing and leave the details of handling machine failures to the programmer, while MapReduce provides transparend fault tolerance. 

This paper provides a great contribution by demonstrating how MapReduce can be easy to use for many use cases, providing parallelization, fault-tolarance, locality optimizations and load balancing all out of the box.
