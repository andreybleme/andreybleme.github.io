---
layout: post
title:  "GraphX: Graph Processing in a Distributed Dataflow Framework"
description: "Summary of the paper published in 2014 presenting GraphX, a distributed graph processing system that it make possible to compose graphs with other collections by reducing the property graph to a pair of collections."
date:   2021-12-28 14:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Joseph E. Gonzalez, Reynold S. Xin, Ankur Dave, Daniel Crankshaw, Michael J. Franklin and Ion Stoica: [https://www.usenix.org/conference/osdi14/technical-sessions/presentation/gonzalez](https://www.usenix.org/conference/osdi14/technical-sessions/presentation/gonzalez)

With the growing focus of the scientific community on proposing specialized solutions for large-scale graph processing systems, processing models that use different data structures (graphs, tables, and unstructured files, for example) need to be implemented using a combination of different tools making this process complex to manage. Aiming to unify ideas presented in specialized graph processing environments (GraphLab, Pregel, and Giraph) and general-purpose processing environments (Hadoop, MapReduce, and Spark), the authors present in this article GraphX. The system consists of a module built on top of Apache Spark, allowing the creation of heterogeneous processing flows through an extensible API, and representations of the relationships between vertices and edges in RDDs, a key contribution of this solution which allows us to compose graphs and collections structured in a single and generic distributed processing model within the same environment.

The authors evaluate GraphX's performance by measuring its performance when processing a graph representing Twitter user followers, containing over a billion edges and 40 million vertices. The experiments were executed on an EC2 cluster with 16 workers with 68GB of memory each. The results show that GraphX has a lower performance than GraphLab when processing graphs alone, and higher performance when processing a complete flow within Apache Spark, having its communication overhead at each interaction reduced by up to 5.8x.

This work presents a significant contribution by proposing an efficient and robust system to run iterative algorithms on graphs within processing environments such as Apache Spark. Taking advantage of the standard join-map-group-by operations, GraphX also benefits from fault tolerance and transparent recovery mechanisms from Apache Spark while still allowing the composition of graphs and collections in the same processing pipeline.
