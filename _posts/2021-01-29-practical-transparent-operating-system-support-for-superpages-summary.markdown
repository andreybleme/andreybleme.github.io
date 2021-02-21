---
layout: post
title:  "Practical, transparent operating system support for superpages"
description: "Paper presented on the 5th Symposium on Operating Systems Design and Implementation, describing a superpage management system that improves the performance of applications by increasing the TLB coverage and reducing TLB misses."
date:   2021-01-29 21:00:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper by Juan Navarro, Sitaram Iyer, Peter Druscheland Alan Cox: [https://www.usenix.org/legacy/events/osdi02/tech/full_papers/navarro/navarro.pdf](https://www.usenix.org/legacy/events/osdi02/tech/full_papers/navarro/navarro.pdf)

This paper develops a general superpage management system, balancing many tradeoffs while allocating superpages to achieve high and sustained performance for real workloads and a small degradation in pathological situations. Memory pages of large sizes (superpages) enable entries on the TLB (translation lookaside buffer) to map larger physical memory addresses into a virtual address space, allowing performance improvements on many applications. The usage of such an approach implies many problems, mainly physical memory fragmentation.

The authors present a design of a superpage management system that uses the reservation-based allocation paradigm, already discussed in previous work. This approach implies that instead of allocating physical memory one frame at a time as most operating systems, the new system will determine a preferred superpage size for the region encompassing the base page whose access caused a page fault. To cover memory fragmentation control, the new system performs coalescing of available memory regions whenever possible, where the OS page daemon is modified to use the buddy memory allocation mechanism.

After the superpage system design and the main aspects of its implementation are presented, the paper shows the evaluation process reporting the results of the experiments on several benchmark classes. The benchmarks show the efficiency of the new system by demonstrating the benefits of superpages in situations when the system memory is plentiful, and the overhead is also measured in some pathological cases: incremental promotion overhead, preemption overhead, and the total overhead in real scenarios (overhead in practice).

Out of the 35 benchmarks, 18 show improvements over 5%, and 10 show over 25%. The paper confirms the great results of the new superpage system implemented, presenting the many tradeoffs on its implementation and highlighting its robustness even in pathological cases.
