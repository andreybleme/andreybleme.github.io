---
layout: post
title:  "Crash Consistency: FSCK and Journaling"
description: "Paper presenting the Journaling implementation in Linux file systems, along with the techniques used for allowing robust crash recovery from disasters during disk operations."
date:   2021-02-18 16:00:00
tags: [operating systems, paper summary]
comments: true
share: true
---

> Original paper by Stephen Tweedie: [https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf](https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf)

This paper presents the design and implementation of Journaling, a file system mechanism that allows operating systems to recover quickly from crashes and power losses. The file system can become inconsistent if some crash occurs in the middle of updating on-disk structures, this happens mainly due to the order in which the write operations happen in the disk: it updates the Inodes, creates the data block, and adds a new version of the bitmap. A failure during any of these steps can cause garbage data to be stored on disk, space leaks, and inconsistencies.

To prevent these problems, Journaling's basic idea is: before overwriting the disk structures, it first writes down a "note" on what operations the OS will perform on the disk. This way it guarantees that if a crash takes place during an update, the OS can look at the "notes" and try again to execute the write operations. This proposed approach is heavily inspired by the *write-ahead logging* idea usually implemented in databases to address crashing recovery problems.

To avoid excessive write traffic to disk, some file systems that implement the Journaling such as Linux ext3, do not commit each update into disk one at a time. Instead, they can buffer all updates into a global transaction and perform a batch log update. This and other techniques for enabling flexibility and robustness into the Journaling are presented, as well as other alternatives for keeping file system consistency other than Journaling: Soft updates, copy on write (COW), and the file system checker (fsck).

Journaling reduces the time for recovering data after a crash from *O(size-of-the-disk)*, as does the alternative techniques that decides to let inconsistencies happen and then fix them later, to *O(size-of-the-log)*, where the log is the space for the "notes" written before the write operations in the disk. Many modern file systems use Journaling and this paper demonstrates the many crash inconsistency problems that happen in a file system and the way Journaling addresses them.
