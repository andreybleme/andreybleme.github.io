---
layout: post
title:  "Distributed GraphLab: A Framework for Machine Learning and Data Mining in the Cloud"
description: "Summary of the article presenting GraphLab, a fault-tolerant system that provides a dynamic and asynchronous execution model for processing large-scale graphs."
date:   2021-12-22 23:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Yucheng Low, Joseph Gonzalez, Aapo Kyrola, Danny Bickson, Carlos Guestrin and Joseph M. Hellerstein: [http://vldb.org/pvldb/vol5/p716_yuchenglow_vldb2012.pdf](http://vldb.org/pvldb/vol5/p716_yuchenglow_vldb2012.pdf)

The paper presents GraphLab, a system proposed to process large-scale graph structures in an asynchronous, dynamic, and parallel way. Many of the algorithms used in data mining and machine learning processes have distributed processing aspects that make previously proposed alternatives ineffective. Through abstractions where users can access data from a vertex and its neighbors directly, GrahLab lets programmers focus on the sequential execution of the processing steps of the algorithms, instead of forcing them to think about how to parallelize the graph processing. The system also provides a fault-tolerant execution through the Chandy-Lamport checkpoints/snapshots algorithm, which allows GraphLab to restore the last state of the graph partitions in case of a failure in any of the graph processing steps.

The authors present experiments to evaluate the performance of the checkpoint mechanism, and also of the Graph execution engine when running three different graph executions: a list of recommended Netflix movies, Video co-segmentation, and the Named Entity Recognition algorithm. The GraphLab system execution finished its execution process up to 60x faster when compared to Hadoop running in an 8 machine cluster.

Unlike previous proposals for processing or storing large-scale graphs such as Neo4j, Dryad, and Piccolo, GraphLab performs structured and iterative steps to carry out its tasks, allowing the use of different policies that promote consistency during processing: graph coloring and distributed locking. The article does not exhibit a performance comparison with Pregel, a more comparable solution, since Pregel it does not have an open-source implementation.
