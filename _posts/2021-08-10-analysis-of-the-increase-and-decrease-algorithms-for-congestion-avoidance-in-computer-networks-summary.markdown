---
layout: post
title:  "Analysis of the Increase and Decrease Algorithms for Congestion Avoidance in Computer Networks"
description: "Summary of the paper published in 1989 presenting different algorithms for Congestion Avoidance in computer networks."
date:   2021-08-10 23:40:00
tags: [networks, paper-summary]   
comments: true
share: true
---

> Original article by Dah-Ming Chiu and Raj Jain: [https://www.cse.wustl.edu/~jain/papers/ftp/cong_av.pdf](https://www.cse.wustl.edu/~jain/papers/ftp/cong_av.pdf)

This paper provides a rich discussion on congestion avoidance algorithms in computer networks. With the high increase in network heterogeneities back in the ‘80s, a mismatch of arrival and service rates was causing constant congestion and package losses.

The main idea behind the proposed control algorithm is to allow the network to operate at the "knee", that is, before the load "cliff" where it usually gets congested. The presented decentralized decision-making algorithm is based on a binary signal feedback form: a TCP header stores 0 to advise users/clients to reduce its load, and 1 to increase it.

Practical considerations such as scaling system parameters to properly configure the congestion avoidance algorithm, integral allocations, and ease of implementation are discussed as important topics for future experiments and exploration.

This work demonstrates an efficient congestion avoidance scheme that allows networks to operate in low delay and high throughput, relying on the network itself monitoring its resource levels and asking users to increase or decrease the load as appropriate. The presented policy was the one chosen for the Digital Networking Architecture and OSI Transmission Class 4 Networks.
ultiple, simultaneous TCPs with and without congestion avoidance, and total bandwidth used by old and new TCPs.
