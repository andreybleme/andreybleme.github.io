---
layout: post
title:  "SoftRAN: Software-Defined Radio Access Network"
description: "Current distributed control plane for RANs are suboptimal on managing resources of dense wireless networks. SoftRAN presents as a software-defined, fundamental rethink of the radio access layer."
date:   2021-05-20 20:40:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original article by Aditya Gudipati, Daniel Perry, Li Erran Li and Sachin Katti: [https://web.stanford.edu/~skatti/pubs/hotsdn13-softran.pdf](https://web.stanford.edu/~skatti/pubs/hotsdn13-softran.pdf)

Radio resource management decisions that happen today on radio infrastructure do not take into account the impact made at one base station causes on neighboring base stations. Dense deployments, how are called networks with a reuse factor of one, had a broadcast nature of wireless communication that makes clients of a base station notice constant interference.

To address these scalability and network complexity issues, this work presents SoftRAN. Instead of approaching the radio access layer as a collection of independent base stations, all base stations deployed in a given geographical space are now abstracted as a virtual big-base station, being completely software-defined.

Use cases such as load balancing to increase throughput, utility optimizations to increase the quality of service are presented demonstrating where the core elements of the SoftRAN architecture would fit for each case. The authors evaluate its feasibility by analyzing radio elements to controller updates operations and controller to radio elements flow as well demonstrating that overall, SoftRAN is a feasible solution.

Some related work includes self-organizing networks and software-defined wireless networks presented in 3GPP and Cloud RAN. The aspect of self-optimization was yet left unexplored though. OpenRoads and CellSDN try to centralize the control plane for cellular core networks, while SoftRAN tries to help cellular networks better manage their radio resources by restructuring the RAN architecture.

SoftRAN presents to be an approach that efficiently handles the rapidly growing traffic and the intensification of the base station deployments. With a software-defined control plane for RAN abstracting base stations, it opens an important door for future innovations by providing a solid base for a simplified network management model.
