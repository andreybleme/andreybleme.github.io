---
layout: post
title:  "Pregel: A System for Large-Scale Graph Processing"
description: "Summary of the paper presenting Pregel, Google's system for processing large Graphs using a simple computational model while being designed for efficiency and fault-tolerant execution."
date:   2021-12-19 11:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Grzegorz Malewicz, Matthew H. Austern, Aart J. C. Bik, James C. Dehnert, Ilan Horn,
Naty Leiser, and Grzegorz Czajkowski: [https://kowshik.github.io/JPregel/pregel_paper.pdf](https://kowshik.github.io/JPregel/pregel_paper.pdf)

Many real-world structures can be represented by a set of vertices and edges in graphs: groups in social networks, internet computer clusters, etc. This article presents Pregel, a system created to provide a simple computational model capable of processing large graphs in an efficient, distributed, and fault-tolerant fashion. Pregel processes a graph iteratively, performing for each partition of the graph a sequence of steps called superstep, which is a set of user-defined functions executed in parallel in multiple workers. The system receives a complete graph as input, and after processing all supersteps, it ends its execution. One of the nodes of a Pregel cluster is the master node, responsible for orchestrating workers, monitoring their health, and controlling its checkpoints, a technique used in Pregel to provide fault-tolerant execution.

To evaluate Pregel's performance, the authors present executions in a cluster with 300 machines processing a binary tree graph with a billion vertices in order to find the shortest path in this graph with the single-source shortest path (SSSP) algorithm. The system is capable of processing this graph in 180 seconds when using 100 workers, and in less than 20 seconds when using 800 workers. Experiments were also carried out with unbalanced random graphs which represent more precisely real-world scenarios. The total processing time of this graph with 200 million vertices was near 200 seconds, and another with a billion vertices was processed in about 800 seconds.

With a flexible C++ API and a relatively simple programming model, Pregel provides an efficient system for processing graphs at a large scale, with mechanisms to tolerate faults and perform optimizations using combiners and aggregators. The article thus offers a great contribution describing its architecture and the implementation of these mechanisms and also their motivations.