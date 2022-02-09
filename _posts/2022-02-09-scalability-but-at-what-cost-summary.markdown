---
layout: post
title:  "Scalability! But at what COST?"
description: "Summary of the paper presenting COST (Configuration that Outperforms a Single Thread), a metric to evaluate big data platforms in a different way."
date:   2022-02-09 21:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Frank McSherry, Michael Isard, and Derek G. Murray: [https://www.usenix.org/system/files/conference/hotos15/hotos15-paper-mcsherry.pdf](https://www.usenix.org/system/files/conference/hotos15/hotos15-paper-mcsherry.pdf)

This bold paper presents the COST metric, used to measure the efficiency of a system when executing processing models in a single-threaded environment. The authors' motivation for presenting this new metric relies upon the fact that many of the relevant articles presenting solutions for massive data processing, focus on horizontal scalability and parallelism, leaving aside the simple, but important fact that some of these proposals present inferior performance when running more efficient algorithms to process models. As an example, the authors highlight the use of the non-optimal label propagation algorithm, presented in the article ["Pregel: A System for Large-Scale Graph Processing"](https://andreybleme.com/2021-12-19/pregel-a-system-for-large-scale-graph-processing-summary/). When compared to the Union-Find algorithm, the solution used in the Pregel article is 10x less efficient.

This article provides a huge contribution by revealing how certain computational processing models limit the variety of algorithms that can be expressed on a big data platform. To achieve scale parallelism, graph processing systems such as [Pregel](https://andreybleme.com/2021-12-19/pregel-a-system-for-large-scale-graph-processing-summary/), [GraphX](https://andreybleme.com/2021-12-28/graphx-summary/)​​, and [GraphLab](https://andreybleme.com/2021-12-22/distributed-graphlab-summary/) impose this limitation, which is often not noticed nor discussed by the scientific community. The authors convey important topics that emphasize the difference between scalability and efficiency, presenting COST results for executions of the Page Rank algorithm in different and battle-tested environments.
