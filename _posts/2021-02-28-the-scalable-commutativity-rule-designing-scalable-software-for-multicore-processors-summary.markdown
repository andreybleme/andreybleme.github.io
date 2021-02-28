---
layout: post
title:  "The Scalable Commutativity Rule: Designing Scalable Software for Multicore Processors"
description: "Paper produced by MIT CSAIL and Harvard University researchers proving the commutativity rule as a critical aspect of system's interface design to promote scalability."
date:   2021-02-28 00:05:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper by Austin T. Clements, M. Frans Kaashoek, Nickolai Zeldovich, Robert T. Morris, and Eddie Kohler: [https://www.read.seas.harvard.edu/~kohler/pubs/clements13scalable.pdf](https://www.read.seas.harvard.edu/~kohler/pubs/clements13scalable.pdf)

Identifying opportunities for improving a system's scalability before any implementation exists would create high benefits for both developers and the system itself. This paper introduce the commutativity rule, meaning that "Whenever interface operations commute,
they can be implemented in a way that scales".

The definition of operations that scale is also upfront defined as operations that have conflict-free memory accesses on its implementation, where no core writes a cache line that was read or written by another core. To allow developers to identify these operations, the authors created the Commuter tool to automate the reasoning for detecting operations that scale.

To demonstrate the value of the commutativity rule, they explore the commutativity of POSIX to understand changes necessary on its interfaces to improve its scalability and use these results to build a new operating system kernel with conflict-free operations: sv6. Running a benchmarking with a simplified version of POSIX' file system and virtual memory, the results demonstrated that sv6 is conflict-free for 13,528 of the 13,664 tests, while Linux is conflict-free for 9,389 tests.

Previous work demonstrated that shared cache lines and a shared lock affects directly the scalability of a system. Some related work already explored the relationship between the commutativity rule and sequential performance, but this work differentiates itself by proposing to draw conclusions about scalability.

By demonstrating precisely the definition of the commutativity rule using a formal proof, introducing the Commuter to allow programmers to analyze interfaces commutativity, and measuring the results of a broadly scalable implementation of POSIX with sv6, this work provides great contribution and a significant step on helping software developers to understand and exploit multi-core scalability starting at the software interfaces.
