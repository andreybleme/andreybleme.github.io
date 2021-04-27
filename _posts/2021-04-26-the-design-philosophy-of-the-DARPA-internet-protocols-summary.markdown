---
layout: post
title:  "The Design Philosophy of the DARPA Internet Protocols"
description: "Paper from 1988 by David Clark, demonstrating the main motivations behind the early internet protocols design."
date:   2021-04-26 23:40:00
tags: [networking, paper-summary]
comments: true
share: true
---

> Original paper by David D. Clark: [http://web.stanford.edu/class/cs244/papers/DesignPhilosophyDARPA.pdf](http://web.stanford.edu/class/cs244/papers/DesignPhilosophyDARPA.pdf)

This historical paper demonstrates the motivations behind the internet architecture and its protocol suite TCP/IP. Presenting the fundamental internet’s first goal of being an effective technique for multiplexed utilization of existing interconnected networks, David Clark also demonstrates its secondary goals, highlighting how they impacted important decisions.

One example of a goal that directly caused a meaningful impact, was the fact that the internet should, before anything else, be able to continue despite the loss of internet gateways. This "survivability" aspect of the internet was the driving force behind the stateless packet switches and the datagrams, representing the minimum network service assumption we can possibly make.

Overall, the paper confirms that some of the priorities in the early design of the internet do not match some needs of modern use cases. The article provides a great contribution on elucidating the trade-offs that made the network interface much simpler but with an overall efficiency potentially worse.

Reflecting on the real motivations behind the most important internet protocol design is paramount to allow us to move forward on proposing new network solutions.
