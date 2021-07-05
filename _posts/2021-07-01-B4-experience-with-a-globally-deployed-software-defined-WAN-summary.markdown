---
layout: post
title:  "B4: Experience with a Globally-Deployed Software-Defined WAN"
description: "Paper presenting Google's private WAN connecting its data centers through an SDN solution, allowing near 100% of hardware utilization."
date:   2021-07-01 03:40:00
tags: [networking, paper-summary]   
comments: true
share: true
---

> Original article by Sushant Jain, Alok Kumar, Subhasree Mandal, Joon Ong, Leon Poutievski, Arjun Singh, Subbaiah Venkata, Jim Wanderer, Junlan Zhou, Min Zhu, Jonathan Zolla, Urs Hölzle, Stephen Stuart and Amin Vahdat: [https://cseweb.ucsd.edu/~vahdat/papers/b4-sigcomm13.pdf](https://cseweb.ucsd.edu/~vahdat/papers/b4-sigcomm13.pdf)

This paper presents the design and implementation of B4, Google's software-defined network for connecting its data centers. WAN links are typically provisioned to ~40% average utilization while having expensive specialized equipment designed for high availability and treating all bits as the same, meaning that when failure does take place, all applications are typically treated equally despite their highly variable sensitivity to available capacity.

To allow deploying routing and traffic engineering protocols customized to Google's unique requirements, B4 was designed with networking control functionalities provided through an OpenFlow controller communication with switches using OpenFlow agents.

The deployment and operational experience with B4 resulted in a cost-effective WAN bandwidth solution, running many links at near 100% utilization for extended periods of time. A revealed benefit of centralized traffic engineering is the ability to mix priority classes across all edges, making it possible for low-priority traffic to tolerate loss by throttling transmission rate to available capacity at the application level.

By gradually introducing SDN into its existing deployments, Google demonstrated to be able to support existing routing protocols and traffic engineering services while leveraging control at the edge to both measure demand, and balance among competing services based on their relative priority.
