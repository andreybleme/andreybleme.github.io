---
layout: post
title:  "Dune: Safe User-level Access to Privileged CPU Features"
description: "Paper produced by Stanford University researchers presenting Dune, a system that provides direct access to hardware features by taking leverage of Intel VT-x virtualization extension."
date:   2021-03-06 16:05:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper by Adam Belay, Andrea Bittau, Ali Mashtizadeh, David Terei, David Maziéres and Christos Kozyrakis: [https://www.usenix.org/system/files/conference/osdi12/osdi12-final-117.pdf](https://www.usenix.org/system/files/conference/osdi12/osdi12-final-117.pdf)

This paper presents Dune, a system that provides direct and secure hardware access to applications. Consisting of a kernel module that interacts with Intel VT-x, a virtualization hardware, Dune allows applications to benefit from direct access to privileged hardware features such as virtual memory, exceptions, and privilege modes.

To allow direct hardware access Dune module intercepts VM exits so that Dune processes can perform actions such as page fault and calling system calls. Using hypercalls, just like other VMM technologies, the system establishes its communication between application and kernel space. Per-process configuration for hardware access is also an interesting feature that increases the easiness and efficiency of context switching.

The system was evaluated taking into consideration its main applicabilities. A sandbox and a privilege separation application were built to measure security-related aspects of Dune, and also a garbage collector was used to check performance-related behavior. A benchmarking executed in a 16GB RAM machine running Linux, shows that page faults operations pay a fixed additional cost in Dune because VM entries and exits are more expensive than regular fast system calls. On the other hand, ptrace, trap, and appel1/2 are operations that demonstrated to be faster in Dune when compared to Linux.

Previous attempts to safely provide hardware access directly to applications includes the Exokernel and the SPIN project, where Dune differentiates from them mainly in terms of its main goal which is not extensibility, but rather provide access to privileged hardware features so that they can be used in concert with the OS instead of a means of modifying or overriding it.

By leveraging modern virtualization hardware that enables direct execution of privileged instructions in unprivileged contexts, Dune provides for applications efficient and safe access to important hardware features that were traditionally only available to kernels. The fact that Dune is structured as a module that works with an unmodified Linux kernel makes this work outstand since this is a relevant step towards increasing the adoption of such systems.
