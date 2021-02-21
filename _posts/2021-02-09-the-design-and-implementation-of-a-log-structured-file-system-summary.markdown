---
layout: post
title:  "The Design and Implementation of a Log-Structured File System"
description: "Paper presenting Sprite LFS, a sytem implementing a new technique for disk storage management that speeds up both file writing and crash recovery."
date:   2021-02-09 21:00:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper by Mendel Rosenblum and John K. Ousterhout, developed at the University of California
Berkeley: [https://people.eecs.berkeley.edu/~brewer/cs262/LFS.pdf](https://people.eecs.berkeley.edu/~brewer/cs262/LFS.pdf)

Disk access times have not improved as much as the CPU over the years, causing applications to become disk-bound. The Log-Structured File System is the technique presented in this paper that aims to increase disk write performance by eliminating seeks.

LFS achieves this by writing all modifications in disk sequentially in a log-like structure, dividing this log into segments, and applying into the segment a clean policy that compresses the live information from segments that become too fragmented. Its design also allows it to maintain a robust mechanism for crash recovery using checkpoints, which becomes possible given the sequential disk write operations.

Using a collection of benchmark programs the authors evaluated Sprite LFS, their implementation of the LFS. The results demonstrated that for the benchmarks, Sprite LFS is almost ten times as fast as SunOS for the create and delete phases of the benchmark. Sprite LFS also kept the disk 17% busy during the creation phase while saturating the CPU, contrasting with SunOS that kept the disk busy 85% of the time.

Some of the related work from where some design ideas for LFS were borrowed includes the scavenging garbage collectors developed for programming languages and database systems that use the write-ahead logging for crash recovery.

This paper demonstrates that the simple principle of collecting large amounts of new data in a file cache in main memory, then write the data to disk in a single large I/O, when combined with the proper policy-based mechanism to manage segment usage and cleaning can provide a file system that is an order of magnitude more efficient than the existing file systems. 
