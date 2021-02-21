---
layout: post
title:  "Serverless Computation with OpenLambda"
description: "This paper presents the advantages and main challenges of implementing OpenLambda, a platform for building applications using the serverless computation model."
date:   2021-01-07 19:00:00
tags: [operating-systems, paper-summary]
comments: true
share: true
---

> Original paper from 2016, by Scott Hendrickson, Stephen Sturdevant, and Tyler Harter: [https://www.usenix.org/conference/hotcloud16/workshop-program/presentation/hendrickson](https://www.usenix.org/conference/hotcloud16/workshop-program/presentation/hendrickson)

The paper presents OpenLambda, an open-source platform for building applications using the serverless computation model. This burgeoning model is explained as a mentality changing: instead of thinking of applications as collections of servers, the abstraction level increases, and now developers define applications with a set of functions and don't need to manage servers. This new computation model allows applications to scale up rapidly without needing to start new servers and with no configuration required and the paper shows some of its advantages, characteristics, and the main challenges involved for providing this.

One big challenge presented for providing serverless computing relies on memory resource usage. The serverless functions execute on top of containers, meaning that there is a container startup cost involved in lambda executions. The authors describe the AWS Lambda approach of reusing the same container to execute multiple handlers when possible, to amortize container startup costs. Another topic of discussion is the package support: lambdas can fastly start tup because its users will use runtime binaries that are already resident in memory before the handlers start, that being said, it's acknowledged that this benefit disappears if users bundle large third-party libraries inside their handles since the libraries needs to be copied over the network. One alternative discussed for solving this is to make the serverless function platform "package aware", providing special support for popular package repositories such as pip and npm. But as the authors stands, it is not feasible to keep these large repositories in memory on a single function worker.

After presenting the research challenges on implementing OpenLambda, the authors conclude that the presented lambda model is more elastic and stable than previous platforms, such as container-based services. This paradigm presents some new challenges for execution engines, schedulers, memory resource management, and third-party libraries management though. The paper is a significant contribution for enabling researchers to evaluate novel designs and implementations of systems using serverless computation platforms, being OpenLambda a remarkable example of effort for pushing serverless computation research forward.
