---
layout: post
title:  "Software Defined Traffic Measurement with OpenSketch"
description: "This paper presents a measurement architecture and prototype API for software-defined networks. It provides programmable measurement task implementations while maintaining high memory accuracy."
date:   2021-06-02 03:40:00
tags: [networks, paper-summary]
comments: true
share: true
---

> Original article by Minlan Yu, Lavanya Jose and Rui Miao: [http://stanford.edu/~lavanyaj/papers/opensketch12.pdf](http://stanford.edu/~lavanyaj/papers/opensketch12.pdf)

Current SDN research has been typically focusing on the control plane. To further explore measurement APIs in software-defined network contexts, the authors propose a software-defined architecture that separates the measurement data plane from the control plane: OpenSketch.

For supporting a  broad variety of measurement tasks, OpenSketch provides a simple three-stage pipeline that hashes, filters, and counts, built on top of sketch data structures that can be combined to flexibly provide implementation possibilities.

To evaluate the OpenSketch architecture, heavy hitter measurement tasks were implemented in a prototype with packet sampling and a superspreader streaming algorithm. When comparing the proposed solution with NetFlow, OpenSketch presented a better memory accuracy, since its programmable measurement architecture relies on simpler data structures to store statistics.

Making use of such simple data structures (sketches) is what mainly differentiates OpenSketch from previous related work in this matter. ProgME and Gigascope for example, are also programmable packet monitors that support queries on packet streams, but OpenSketch strives for supporting a wide range of measurement tasks allowing multiple tasks to run efficiently at the same time.

OpenSkecth presents as an efficient way to collect and measure measurement data in networks in a software-defined fashion. The chosen sketch data structure demonstrated to promote great benefits on both performance and implementation flexibility aspects.
