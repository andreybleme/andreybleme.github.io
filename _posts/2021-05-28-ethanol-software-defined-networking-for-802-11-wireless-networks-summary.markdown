---
layout: post
title:  "Ethanol: Software Defined Networking for 802.11 Wireless Networks"
description: "This paper presents Ethanol, an SDN architecture for dense wireless networks, enabling vendor-agnostic service-aware control algorithms and network-wide control of QoS, user mobility, and access point virtualization."
date:   2021-05-28 22:40:00
tags: [networking, paper-summary]
comments: true
share: true
---

> Original article by Henrique Moura, Gabriel V. C. Bessa, Marcos A. M. Vieira and Daniel F. Macedo from UFMG: [https://homepages.dcc.ufmg.br/~mmvieira/cc/papers/Etanol.pdf](https://homepages.dcc.ufmg.br/~mmvieira/cc/papers/Etanol.pdf)

Dense ubiquitous wireless networks currently support management architectures that employ proprietary network controllers to perform network-wide optimizations. These controllers only manage compatible devices and remain closed allowing few customizations other than the ones already provided by its manufacturers.
 
The software-defined network (SDN) paradigm already addresses this problem, proposing a new structure for networks by separating the control plane from the data plane while maintaining a logically centralized controller bringing programmability to networks. The existing SDN solutions though, provide programmability only for switching elements of the network. WLANs would strongly benefit from SDN-enabled access points allowing the deployment of context and application-aware control algorithms.

Ethanol presents itself as a new SD architecture for dense IEEE 802.11 Wireless LANs that refactors the control plane functionalities between the APs and the controller. It addresses the lack of support from OpenFlow (the current *de facto* SDN implementation) for abstractions and primitives to control wireless networks, which had peculiar aspects when compared to wired networks, such as variable link characteristics and node mobility.

An Ethanol prototype was implemented to evaluate its basic functions. The controller is a Linux computer using a modified version of POX, connected to an access point Broadcom WRT54GL router running OpenWRT. Three scenarios were approached in the experiments: a load-aware client association, a quality of service monitor, and an ARP Overhead test.

The experiment results show that Ethanol is capable of improving WLANs programmability and allows further innovation, even reducing ARP overhead which usually consumes almost 10% of the air time of wireless links.

Previous related works include OpenRoads, a mobile wireless network that enables experimental research using network virtualization. While it focuses on virtualization, Ethanol also demonstrates capabilities for handling QoS, security, and mobility. ODIN also applies SDN concepts to solve client mobility issues in WLANs, but it does not support QoS enforcement and traffic shaping as Ethanol does.

This paper provides a fabulous contribution to demonstrating an SDN concept extension through Ethanol, an architecture that enables fine-grained management and control of dense wireless networks.
