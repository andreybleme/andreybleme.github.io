---
layout: post
title:  "RadixVM: Scalable address spaces for multithreaded applications"
description: "Paper from MIT CSAIL presenting RadixVM: a new virtual memory system design that enables fully concurrent operations on shared address spaces for multithreaded processes."
date:   2021-02-06 19:00:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper from 2014, by Austin T. Clements, M. Frans Kaashoek, and Nickolai Zeldovich: [https://pdos.csail.mit.edu/papers/radixvm%3Aeurosys13-2014-08-05.pdf](https://pdos.csail.mit.edu/papers/radixvm%3Aeurosys13-2014-08-05.pdf)

This paper aims to address the problem of multithreaded applications on many-core processors being bottlenecked by contended locks inside the operating system’s
virtual memory system. It presents a new virtual memory design and implementation in RadixVM, a system that enables concurrent operations on shared memory address spaces for multithreaded processes on cache-coherent multicore computers.

The main idea presented by the authors is that RadixVM can ensure that address spaces operations (*nmap*, and *munmap*) happening on non-overlapping regions of the memory can scale perfectly, by making them run in parallel instead of serializing it as most Operating Systems do.

To achieve this goal, three techniques are combined on its design: a different data structure for organizing metadata and the space address mapping named Radix tree, a memory-efficient reference counting scheme, and a TLB shootdown scheme that limits the number of cores that must be contacted to perform a TLB shootdown (the operation that happens when a thread removes a region from its address space).

To evaluate RadixVM, the authors compared RadixVM virtual memory performance against Linux and Linux with Bonsai running multiple page write operations per second. The benchmarks results presented demonstrate that RadixVM achieves its goal of allowing operations on non-overlapping regions to scale with the number of cores, highlighting some exceptions where the system outperformed such as the pipeline microbenchmark.

There are attractive related works that the authors took into consideration when designing the main aspects of RadixVM design. The scalable reference counter scheme for example inherits many ideas from sloppy counters, SNZI (scalable nonzero indicators), shared vs. local counts in Modula 2, and other techniques to increment and decrement using per-core counters using delays and batches for zero detection.

Some techniques to reduce the per-core page table overhead were not implemented, such as discarding the page table memory. This caused a sense of curiosity on why some of these presented ideas were not implemented by the authors. RadixVM is well detailed and the main design aspects of its implementations are very well described in the paper, which validates the paper contributions even more.
