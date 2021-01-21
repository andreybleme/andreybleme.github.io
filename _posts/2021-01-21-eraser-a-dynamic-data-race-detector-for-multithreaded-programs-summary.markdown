---
layout: post
title:  "Eraser: A Dynamic Data Race Detector for Multithreaded Programs"
description: "This paper presents the design and implementation of Eraser, a tool for dynamically detecting racing conditions (data race) in lock-based multithreaded programs."
date:   2021-01-21 19:00:00
tags: [operating systems, paper summary]
comments: true
share: true
---

> Original paper from 1997, by Stefan Savage, Michael Burrows, Michael Burrows, Greg Nelson, Patrick Sobalvarro and Thomas Anderson: [https://dl.acm.org/doi/10.1145/265924.265927](https://dl.acm.org/doi/10.1145/265924.265927)

Multithreaded programming is a practice full of challenges. This paper presents Eraser, a tool for dynamically detecting racing conditions (data race) in lock-based multithreaded programs. As described initially in the paper, data race happens when two concurrent threads access a shared variable and one of these accesses is a write operation.

The attempt to prevent such problems is diverse, and as the authors stand, most of the previous work on dynamic race detection is based on a principle called *happens-before*, which is able to handle many types of synchronization, comes with some additional performance cost. Eraser instead is focused on checking that all shared memory access follows a locking discipline, which is a programming policy that ensures the absence of data races by requiring that every variable shared between threads is protected by a mutual lock for example. The Eraser's Lockset algorithm is described in detail, and its dynamics of checking each shared variable *v* of a given program, maintaining a set of candidate locks for *v*, and raising warnings whenever a potential data race is discovered is the overall solution for the presented problem.

The authors evaluated the Eraser by running it on simple programs that contained common synchronization errors, which allowed the authors to find and fix bugs in Eraser. After that, they tackled large multithreaded servers written by experienced programmers and applied Eraser to see the results. This interaction revealed some additional implementation needs no Eraser that the authors implemented for increasing the tool robustness, such as the addition of flags, allowing Eraser to ignore specific code snippets to avoid raising false alarms. Eraser worked well on these large systems as well, finding undesirable race conditions on three of the four server programs.

The Lockset algorithm with its evolution and limitations is extremely well detailed in the paper by its authors. Attaching code snippets and pseudo-code made the paper reading very insightful and well detailed. After presenting the results, the article concludes that enforcing simple locking disciplines instead of checking for data races in general as previous work focused on, is a solid advantage. Despite its well-known performance limitations, Eraser with its Lockset method has shown to be really promising, and an attractive alternative to the methods presented in related work.

