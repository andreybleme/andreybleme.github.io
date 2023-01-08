---
layout: post
title:  "Traffic monitoring applications using eBPF programmable networks"
description: "Summary of a paper demonstrating that network traffic monitoring tools can be efficiently implemented using an SDN approach with an eBPF/BPFabric data-plane."
date:   2023-01-08 10:59:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original paper published in PT-BR by Elerson R. S. Santos, Eduardo P. M. Câmara Júnior, Marcos A. M. Vieira, Luiz F. M. Vieira: [https://sol.sbc.org.br/index.php/sbrc/article/view/7376](https://sol.sbc.org.br/index.php/sbrc/article/view/7376)

Network traffic monitoring has increasingly become a critical aspect of software solutions nowadays. Traffic engineering, anomaly detection, and quality of service are examples of things that are only provided at a high level when applications are somehow monitored. However, traffic monitoring has gained little attention in SDN (software-defined networks) architectures.

In this paper, the authors present the implementation of a traffic monitoring mechanism that allows using [BPFabric](https://ieeexplore.ieee.org/document/7966898) for monitoring network traffic, using heaps, sampling techniques, and sketches. Sketches are used for heavy hitters’ detection, traffic counting, and flow distribution estimation, while the solution relies on the probabilistic solutions: Bloom Filter, Count-Min Sketch, k-ary Sketch, and PCSA.

An anonymized dataset from [CAIDA](https://www.caida.org/catalog/datasets/completed-datasets/) was used to evaluate the solutions’ efficiency when running monitoring tasks, gathering data from a commodity switch installed in a [mininet](http://mininet.org/) virtual network. The results show that most of the traffic analyses are done successfully with a small number of false positives for Count-Min Sketch and Bloom Filters. When counting the number of active flows on a simulated 0.5 Mbps datalink, the solution presented an average of 2%. For a 1 Mbps datalink, the application presented critical performance issues that prevented the analysis to be finished.

There is very little detail on how exactly BPFabric is used, how is the data plane implemented, and how the control plane performs the monitoring queries on the switches. But the paper provides good contributions demonstrating that an eBPF application (BPFabric) can be efficient and flexible in providing network traffic monitoring tools. Several data structures and probabilistic models were implemented on top of these technologies, showing that an SDN approach can enable new implementations for network observability and monitoring. 
