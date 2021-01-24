---
layout: post
title:  "Non-scalable locks are dangerous"
description: "This paper shows that non-scalable locks can cause dramatic collapse in the performance of real workloads, even for very short critical sections, and demonstrates a replacement of the offending nonscalable spin locks with scalable ones."
date:   2021-01-24 14:00:00
tags: [operating systems, paper summary]
comments: true
share: true
---

> Original paper by Silas Boyd-Wickizer, M. Frans Kaashoek, Robert Morris, and Nickolai Zeldovich: [https://pdos.csail.mit.edu/6.828/2014/readings/linux-lock.pdf](https://pdos.csail.mit.edu/6.828/2014/readings/linux-lock.pdf)

The authors demonstrated in this paper that non-scalable locks can cause dramatic collapse in the performance of multi-core environments when running with real workloads. The paper presents a model of non-scalable locks performance that explains the presented phenomenon of performance suddenly collapsing as new cores are added to process threads.

To demonstrate the problems with non-scalable locks, the authors exercised spinlocks with benchmarks of four different programs, two of them running with real workloads. The results show that the throughput increases with more cores for a while, but it decreases after some number of cores. A good performance rate with *N* cores is often followed by lower performance when adding two or three more cores, which is totally unexpected. To understand why this happens, the authors used a Markov chain model for the Linux ticket lock behavior, where different states in the chain represent the different cores queued waiting for a lock. In the article section where it is demonstrated the model validation, it is also presented one difference between the predicted and the measured speedup: the predicted performance collapse was more gradual than the collapse observed in the real hardware, the ticket lock's performance demonstrates to be very unstable near the collapse point.

A plausible way to understand the collapse, as described, is that the time taken to transfer the lock from one core to another increases linearly with the number of contending cores. To solve this problem, the authors present some scalable-locks already discussed in previous work and chose the *MCS lock* as the candidate to replace the offending ticket locks in the Linux ticket lock system. The results show that the performance of the four applications used in the benchmark increases at least 3.5x and in one case the performance is increased by more than 16x.

This work concludes that using non-scalable locks is dangerous because a program that has been tested with *N* cores may demonstrate a drastic performance collapse when a few more cores are added. Previous related work has already demonstrated this phenomenon, but this paper provides a Markov model that describes the sudden collapse and precisely explains this model by providing comprehensive locking costs for short critical sessions and large critical sessions.
