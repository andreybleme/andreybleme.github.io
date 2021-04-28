---
layout: post
title:  "End-to-end Arguments in System Design"
description: "This paper presents the end-to-end argument, which comprehends most of networks applications"
date:   2021-04-27 23:40:00
tags: [networking, paper-summary]
comments: true
share: true
---

> Original paper by J.H. Saltzer, D.P. Reed and D.D. Clark: [https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf](https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf)

In this paper is presented an interesting system design argument, which basically, stands that functions could easily be placed in the end/border of a system instead of being provided at a low level.

This argument is heavily used in networking, and the paper follows providing many examples of its usage in delivery guarantees, secure transmission of data, duplicate message suppression, and transaction management in general.

This argument is proposed as a point of consideration, not an absolute rule that has to be used always. This argument needs to be balanced with performance, where is acceptable to implement low-level functions to reduce the number of times an end-to-end function is executed for example.

Many applications have since then broadly used this argument to organize its layers such as operating system kernels and network systems. The article provides an important contribution by elaborating on different trade-offs between low-level functions and the end-to-end argument.
