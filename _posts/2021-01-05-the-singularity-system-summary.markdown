---
layout: post
title:  "The Singularity system"
description: "This paper shows how safe, modern programming languages let Microsoft rethink the architectural trade-offs in a experimental operating system."
date:   2021-01-05 21:00:00
tags: [operating systems, paper summary]
comments: true
share: true
---

> Original paper from 2010, by James Larus, Galen C. Hunt: [https://dl.acm.org/doi/10.1145/1787234.1787253](https://dl.acm.org/doi/10.1145/1787234.1787253)

The paper presents The Singularity project from Microsoft Research, the operating system built on top of the high-level programming language Sing#. The main motivation presented in the paper for building this project lies in the fact that operating systems have evolved much more slowly than the computing environment around them, meaning that many modern software practices could be part of operating systems but they are still not built with this mindset essentially due to the frequent usage of non-safe programming languages such as C, C++ and Assembly.

The main design principles presented in the paper for building the Singularity OS are: using a **safe high-level programming language** since they prevent a lot of critical errors and facilitate development by being surrounded by modern software development and verification tools. **Avoid critical system failures** when some failure occurs in a process operation of similar OS tasks by enabling the system to recover and respond without having to reboot. Make the **system self-described** at all possible levels of abstraction introducing specifications at the boundaries of each of the many OS components, increasing the system's reliability and error prediction. Using the type and memory-safe language Sing#, as the authors describe, enables multiple processes to be fully isolated even being executed in the same hardware addresses. This is one of the examples of the great advantages of using a safe high-level programming language as the Singularity design principle describes.

Two important abstractions described along the paper are the **SIP**s (software isolated processes) and the **channels**, which allow the inter-process communication. SIPs communicate with each other by sending strongly typed and well-defined messages into a channel, being the Singularity runtime responsible for revoking the access to the sent message from the sender process. This process plays an important role in the system, making sure that processes never access data from another process undesirably. It's also highlighted the important fact that, since processes run in the same hardware space and has its isolation guaranteed by the Sing# language safe constraints, they can also run in the same level of privilege as the kernel. It means that a process can perform high privileged calls in a simplified manner where a system call is simply a function call, avoiding the overhead of switching the privilege mode (from user mode to kernel mode) to perform these calls significantly increases the OS performance as the paper demonstrates.

Some of the key aspects of the Singularity design are also discussed at the end of the paper. The authors highlight some of the drawbacks of the well-defined contracts since its usage also means an increase of the frustration for programmers to implement additional code for marshaling and unmarshalling messages, defining operations and structs. They conclude the paper reporting that the lessons taken from Singularity were applied to other Microsoft systems since some key design decisions showed to be highly valuable.
