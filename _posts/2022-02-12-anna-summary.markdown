---
layout: post
title:  "Autoscaling Tiered Cloud Storage in Anna"
description: "Summary the paper presenting Anna, a distribuited KVS system designed to balance cost and latency requirements."
date:   2022-02-12 15:00:00
tags: [big-data, paper-summary]
comments: true
share: true
---

> Original paper by Chenggang Wu, Vikram Sreekanti and Joseph M. Hellerstein: [https://dsf.berkeley.edu/jmh/papers/anna_vldb_19.pdf](https://dsf.berkeley.edu/jmh/papers/anna_vldb_19.pdf)

Distributed key-value storage (KVS) systems usually respond to a usage profile that bears some challenges. The major ones are the stored volume variation, skewed workloads, that is, writing and reading operations happening in intense frequency over a small set of keys, and lastly the variation of hotspots, meaning that hotkeys can become cold (negligibly accessed) over time, and vice versa. This paper presents the Anna system, proposed to solve these problems in a robust and fault-tolerant manner. The system has a tiered storage architecture, where cold keys are stored on hard disks (EBS), while keys with high access frequency are stored in memory (EC2). This architecture allows the system to promote and demote keys between layers as the frequency of access to them changes over time. 

The solution was evaluated for cost, performance, and failure recovery capability. The results show that the Anna system is able to provide lower cost when compared to the distributed database DynamoDB, while presenting a similar performance for intensive workloads. Anna is also able to recover from single server outages failures quicker than Redis. Using a combination of techniques such as key replication, horizontal scaling, and allowing data movement vertically between storage tiers, the article provides a great contribution by presenting a resilient and high-performance system for storing key-value data.

> I have presented a seminar on this paper. You can watch the [full video presentation on YouTube](https://youtu.be/gzspGRsFVEs), and check the [slides on my speaker deck](https://speakerdeck.com/andreybleme/autoscaling-tiered-cloud-storage-in-anna).