---
layout: post
title:  "The Evolution of the Unix Time-sharing System"
description: "The paper written in 1984, concentrates on the evolution of UNIX file system, the process-control mechanism, and the idea of pipelined commands."
date:   2020-12-29 22:00:00
tags: [operating systems, paper summary]
comments: true
share: true
---

> Original paper by Dennis M. Ritchie: [http://www.read.seas.harvard.edu/~kohler/class/aosref/ritchie84evolution.pdf](http://www.read.seas.harvard.edu/~kohler/class/aosref/ritchie84evolution.pdf)

Dennis M. Ritchie presents in this paper the evolution of the UNIX operating system, from its initial implementation running in the PDP-7 until its later days in PDP-11. The paper approaches not only the technical aspects of the evolution of the system but also the social events that somehow influenced the system's evolution.

The group responsible for developing the UNIX to the PDP-7 worked earlier in another operating system, the Multics. As Dennis stands, Multics only delivered a few of the things it promised to deliver and it was also too expensive. That was when Dennis and his colleague Thompson jointly developed a file system, which according to the author, was similar to what became the UNIX file system years later. At the same time, Dennis and Thompson also implemented the Space Travel game, which served as a way to learn how to prepare programs to run on Multics, the previous Operating System. Soon after, they implemented the initial operations of the previously designed file system, making it possible to create, edit, copy and delete files, and then, the UNIX operating system that we know today was born.

Dennis detailedly describes many of the limitations that UNIX still had when it was deployed on PDP-7, mainly limitations on its file system. As an example of these limitations, Dennis highlights the fact that users were not able to run programs while any access to the disk was going on. Still talking about the PDP-7, details of the implementation of the UNIX process control system are presented, which still did not use the fork or wait system calls. Only the exit system call was used at the time, and its initial implementation was highly inspired by other operating systems such as CTSS, Multics, Honeywell, and IBM's TSS. The author follows by describing the separation of the fork and exec functions, being this implementation relatively simple: simply increasing the size of the table that stores the processes and increasing the swap space available on the disk. The exit command was also improved during this period, being simplified by removing its control over the internal calls of the exec function and being responsible now only for cleaning (emptying) the process table.

With the arrival of PDP-11, the article elaborates on how project members made UNIX successful in the laboratory's patent department, having allowed the ability for users to use the main symbols of mathematical operations in a perfect way through the UNIX terminal. Shortly after the success of UNIX on PDP-11 computers, pipes were implemented allowing various combinations of program executions, a feature that is widely used until today.

Finally, Dennis describes the process of adopting high-level languages on UNIX, starting with the replacement of its assembler used until then, with the B language, when later in 1973, the system was completely rewritten in the C language demonstrating UNIX's great capacity to be connected to programs written using modern, high-level languages. The author concludes with an interesting observation about the perception of evolution that they had at the time when most of these implementations were made: according to Dennis, back when they worked on UNIX, the evolutions described in the paper appeared to be more considerable than it seems at the time he wrote the paper (almost 10 years later, given the date of publication of the article "1979").

> **Interesting fact:** Dennis Ritchie, the author of this paper, is also the creator of the C programming language. Not surprisingly, UNIX was re-written in C in 1973, one year after C lang was created by him in Bell Labs.
