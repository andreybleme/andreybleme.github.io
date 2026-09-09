---
layout: post
title:  "Luiz André Barroso and the datacenter as a computer"
description: "From a room full of servers, to a single super computer."
tags: [offtopic]
date:   2026-09-16 13:13:52
comments: true
share: true
---

Every time you make a Google search, watch a YouTube video, or send an e-mail using Gmail, you’re using an architecture designed by a Brazilian engineer named Luiz André Barroso.

As a former VP of engineering and later Google Fellow, Barroso was the architect behind Google’s early datacenter and infrastructure strategy [[1]](#references). The insight he provided is simple, but world-changing: **a datacenter should be treated as a single computer, not a room full of servers.**

![Luiz André Barroso](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/barroso_profile.webp "Luiz André Barroso")

Figure 1. Luiz André Barroso, former VP of Engineering and later Google Fellow

## The era of co-location
With the challenge of indexing the entire web, Google found itself in the 2000s needing to scale its services to support the massive volume of web pages to index and queries to serve. To keep up with the growth in computing demand, they rented spaces from specialized companies that offered co-location services where they could fit servers. These spaces were filled with servers, together with all the networking, storage, power supply, and cooling infrastructure provided by third-party companies that offered co-location spaces for any company that wanted to host their applications. That’s how most internet companies with high computing demands started approaching datacenters back then: rent a warehouse with the server machines set up, and run applications on top of the leased infrastructure.

![Co-location Google datacenter](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/barroso_colocation.jpg "Co-location Google datacenter")

Figure 2. Co-location space used by Google circa 2000 in Santa Clara, California [[2]](#references)

Working with that many computers together is hard. There are so many things that can go wrong in a facility like that: energy can fail, cooling can be insufficient at times, overheated servers can cause hardware failures, and of course, software can also fail at any time. The fragility of this model is a product of the way such datacenters were built back then. The many technical disciplines involved in a datacenter building were all approached separately. A civil engineer builds the warehouse (walls and base structure), mechanical engineers come later to build the cooling system, electrical engineers then build the energy distribution network, later on, hardware engineers come to assemble the racks filling them with servers, and finally, software engineers wrote the software that runs on top of that infrastructure.

## Warehouse-scale computers
Barroso and the Google team were one of the first groups to notice that the lack of integration between these engineering disciplines was a major reason behind the  unreliable and inefficient datacenter infrastructure. That’s why they started to build their own datacenters.

![Modern Google datacenter](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/barroso_nl_datacenter.jpg "Modern Google datacenter")

Figure 3. Modern Google datacenter in Eemshaven, Netherlands

When building their own datacenter end-to-end, it was now possible to optimize every step of the building process according to their needs. Power supply, cooling specifications, floor plans, everything was built by their own team. That’s when it got clear that **a datacenter was not a building with a bunch of computers, it was the computer itself.**

Just like a computer serves an application through the collaboration of its inner components, a datacenter serves a massive-scale system with its facilities. A single computer has a fan for cooling the CPU heat, and a datacenter has cooling towers. A single computer has voltage regulators; a datacenter has an electrical substation to provide power. We can then think of a datacenter as a computer that serves the Google search application, for example, since such a huge web service is not served by one or two computers, but by thousands of servers.

In 2013, Barroso, in his most famous work, “The Datacenter as a Computer” [[3]](#references), coined the term **warehouse-scale computers (WSC)** to call attention to the massive scale of software infrastructure, and hardware platform involved in such systems. This work marks a departure from traditional computing models that assume a program runs on a single machine. Instead, a program now runs on thousands of servers, consisting of individual programs clustered across thousands of individual servers.

## A specific kind of computer

Warehouse scale computers are distinguished from traditional datacenters, which were merely buildings with many servers co-located. WSCs are built with a holistic approach, aiming for an integrated design and massive scale of components that will be used as a homogeneous piece serving specific software workloads. To take advantage of such a design, systems running on top of WSCs are typically very large internet services that require specialized hardware and have a well-known type of workload. We can think of video serving, web search, and machine learning systems, which have driven the adoption of specialized accelerators like GPUs and TPUs, as examples of systems running on WSCs today.

The primary goals of a WSC are cost efficiency and fault tolerance. When you spend millions of dollars to build a giant computer, it better work without crashing, right? The immense scale of WSCs mandates that tolerance to failure is part of the system design. With such a high number of components that can present a fault (such as servers, disks, storage, and networking), the software must be designed to gracefully tolerate faults, ideally, in a way that failures have little or no impact on service level performance.

The state in which WSC systems have to operate is a near-continuous recovery mode. This is particularly challenging for online services that have to be available every minute of every day. As you can imagine, a fault-free operation on a large collection of hardware and system software is infeasible. Tolerating failures at scale is a must for modern systems running on WSC. Because of that, important system engineering techniques are applied to handle variability in fault tolerance. In the following section, let’s see a real-world example of how latency variability at scale impacts such systems, and some architectural answers to these challenges. 

## Tail latency is the enemy
Imagine a web search application with a client making queries to a single server that responds with the query results. The response time of 99% of the requests is around 10ms, and only 1% of the requests take 1 second. Sounds like a reasonable, decently reliable system, right? Not perfect, but ok.

Now, let’s assume that the number of pages to be indexed has grown, and the client needs 10 servers to respond to a single query, not just 1. The result now is that 90% of the requests will fall into the 10ms response time, and 10% of all queries will take 1 second.

If we take that same example and apply it to a real scale of an online service where a user request must gather responses from 100 such servers in parallel, **63% of all user requests will take more than 1 second**. Notice that the response time of a single server remained the same. It is the collection of servers working together that caused such a significant decrease in the overall quality of service. As the number of servers grows, the probability of a request taking 1 second increases, as the probability formula confirms `1 - (1 - p) ^ n`, with n equal to the number of servers.

![Latency variability](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/barroso_latency_variability.jpg "Latency variability")

Figure 4. Latency variability with 1% of failing requests as the number of servers grows

This example illustrates a fundamental challenge in designing and operating large-scale systems for interactive web services. The latency of the slowest request, that is, the tail of a latency distribution (percentiles 99th and 99.99th), can seriously impact the responsiveness of the entire service. This problem was observed and discussed in greater detail in the paper “The tail at scale,”[[4]](#references) published by Jeff Dean and Luiz André Barroso in 2013. As a system’s scale increases and more servers are used to handle user requests, latency variability is magnified.

In the book “The Datacenter as a Computer,”  the authors demonstrate how this hypothetical scenario is affected as cluster size increases. Even for services with only 1 in 10,000 requests taking more than 1 second to respond, a deployment with 2,000 servers would experience 1 in 5 user requests taking more than 1 second.

You may be thinking, “let’s just improve the response time of a single server then, let’s solve the problem causing 1% of the requests to finish in 1 second”. Yes, that’s a good idea, and maybe feasible in moderate-sized systems. But remember, we are talking about a warehouse-scale computer. There are too many sources of latency variability in a computer composed of thousands of servers:

- **Resource contention:** shared resources such as CPU cores, processor caches, memory, and networking bandwidth can suffer from severe contention when accessed simultaneously by multiple applications.
- **Background activity:** periodic tasks such as daemons running in the background for things like log aggregation or garbage collection can cause temporary latency spikes and performance hiccups.
- **Hardware and OS issues:** movement from active to inactive states on power management components, or even OS thread wakeups, can add latency.
- **Storage issues:** SSD devices can provide latency delays of 10x-100x when garbage collection is running.
- **Queuing:** even the multiple layers of queuing that exist between servers and network switches can add latency variability.

We usually ignore these factors because we simply don’t work with software at such a scale, and to be fair, most companies back then were also not looking at this problem since they didn’t have the scale of Google. But if you, like me, are curious to know how to solve these problems, let’s see a few solutions.

## Embracing latency variability
Living with the fact that latency variability will occur is the new reality for systems running on top of warehouse-scale computers. Because of that, a whole class of solutions was proposed to mask or workaround the existing latency variability. Jeff Dean and Barroso called these “tail-tolerant techniques”.

Replication plays a major role in curbing latency variability within a single high-level request. That’s the most important observation that enables the **hedge request**. With hedge requests, instead of the client sending a single request and hoping that the server responds within a reasonable time, it sends the same request to multiple replicas and uses the results of the one that responds first. The client sends the first request to the replica, which is supposed to respond faster, but it falls back to sending a secondary request after a brief delay.

![Latency variability](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/barroso_hedge_request.jpg "Latency variability")

Figure 5. Hedge request with request A being sent to two different servers

This is a very interesting technique, but it is only effective if you know how long you should defer the second request. A naive implementation of hedge requests could create unacceptable overhead. Imagine you have to make a request and intentionally wait an arbitrary amount of time before you can send an extra request to a replica, which could also take more time to respond than the ideal. That’s where I think the cleverness of Google’s engineers comes into play.

They propose deferring the second request only until the first request has been outstanding for more than the 95th percentile of the latency expected for that kind of request. That means the first request would create an extra load overhead of only 5%, while significantly improving observed tail latency. It is brilliant. But it obviously requires a considerable amount of knowledge around the latency behavior of your system and the kind of software workload you’re dealing with.

Is it worth the effort, or is it even possible to measure the latency percentiles for all requests participating in high-level user requests to apply hedged requests with a well-known wait time? I don’t know. What I know is that it was definitely worth it for them, as their experiments confirm. A benchmark reading values for 1,000 keys in a BigTable table distributed across 100 servers showed an improvement of tail latency from 1,800ms to 74ms after adding the hedging request to be sent after a 10ms interval. This result was achieved by sending just 2% more requests. If it was worth the effort for them, it is very likely worth it for other large-scale companies out there with massive systems.

## Escaping latency variability
Not only is living with latency variability important, but also finding ways to reduce it. Another class of solutions was proposed with the aspiration of reducing latency variability. The key observation is that the performance of underlying machines is not uniform and not constant. Machines vary in performance over time due to many reasons mentioned earlier (shared resources interference, throttling, etc), so large-scale systems must somehow detect and react to such variability in individual components.

One way to reduce latency variability is to put components into **latency-induced probation**. It’s so nice that they can find a fancy name for everything. Latency-induced probation is the technique used to detect situations where a system performs better when excluding a slow machine. By observing the latency distribution of responses from multiple servers, the system can exclude a slow machine or put it under probation. When a machine is removed, the system continues to issue shadow requests to it to collect statistics about its latency, and incorporate that machine back into the service after the problem causing delays is resolved.

A variation of that technique is the **canary request**. Instead of forwarding a single request to hundreds or thousands of servers, a root server initially passes the request to one server, and then another. The remaining servers only get the requests if the root receives a successful response from the initial leaf servers that got the request. The idea of canary requests is to avoid passing a problematic request that can potentially cause large delays in a service due to untested code paths or implementation errors. Propagating errors at scale should be avoided, and canary requests can help with that.

It’s important to acknowledge that such insights were only possible back then because Google was in a unique position where they were using entire datacenter buildings. It was absolutely not common for an internet company back then to use every single server, rack, networking switch, everything from the entire datacenter building. Nevertheless, they were the ones who pioneered, documented, and published with excellence the engineering practices used even today to solve problems in large-scale systems.

## The legacy

What I love about Borroso’s work is that it always presents problems with a holistic, multi-disciplinary point of view. He saw the datacenter as a computer, not a bunch of servers. His unique way of mixing software engineering expertise with electrical engineering skills created possibilities for innovations in energy, hardware, and software that allowed us to go truly far as an industry. 

His work influenced Google Borg [[5]](#references), the internal cluster management service that later inspired Kubernetes and changed DevOps forever. It also influenced storage systems like Google’s Bigtable [[6]](#references) and Spanner [[7]](#references), that showed us how high the bar could be in terms of scale and reliability for distributed systems. 

As a computer scientist myself, I can only tell the story of a few of his contributions to systems and software, but his contributions go beyond computer science. I highly encourage you to read his work on energy proportionality [[8]](#references) and power provisioning [[9]](#references). These are extremely relevant topics to reduce energy waste and pave the way towards an intelligent use of renewable energy in datacenters.

---

![Photo of Hyacinth macaw by Luiz Andre Barroso](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/barroso_pantanal.jpg "Photo of Hyacinth macaw by Luiz Andre Barroso")

Figure 6. Hyacinth macaw, Pantanal, Brazil. Photo by Luiz André Barroso [[10]](#references).

Luiz André Barroso passed away in 2023 [[11]](#references).

Every datacenter today is built upon many of the ideas presented in his work. This includes the hundreds of new facilities built to supply AI computing demands. 

His radical ideas shaped cloud computing and changed the global internet forever.

## References {#references}

[1] Luiz André Barroso bio, [https://barroso.org/bio.html](https://barroso.org/bio.html)

[2] 2020 Eckert-Mauchly Award Lecture - Luiz André Barroso, [https://youtu.be/Lv_eZX99lUU?si=6enIrqpNUr3PzDgT](https://youtu.be/Lv_eZX99lUU?si=6enIrqpNUr3PzDgT)

[3] The Datacenter as a Computer, [https://doi.org/10.1007/978-3-031-01761-2](https://doi.org/10.1007/978-3-031-01761-2)

[4] The Tail at Scale, [https://cacm.acm.org/research/the-tail-at-scale/](https://cacm.acm.org/research/the-tail-at-scale/)

[5] Large-scale cluster management at Google with Borg, [https://dl.acm.org/doi/10.1145/2741948.2741964](https://dl.acm.org/doi/10.1145/2741948.2741964)

[6] Bigtable: A Distributed Storage System for Structured Data, [https://dl.acm.org/doi/10.1145/1365815.1365816](https://dl.acm.org/doi/10.1145/1365815.1365816)

[7] Spanner: Google’s Globally Distributed Database, [https://dl.acm.org/doi/10.1145/2491245](https://dl.acm.org/doi/10.1145/2491245)

[8] The Case for Energy-Proportional Computing, [https://ieeexplore.ieee.org/document/4404806](https://ieeexplore.ieee.org/document/4404806)

[9] Power provisioning for a warehouse-sized computer, [https://dl.acm.org/doi/10.1145/1250662.1250665](https://dl.acm.org/doi/10.1145/1250662.1250665)

[10] Luiz André Barroso wildlife photos, [https://barroso.org/wildlife.html](https://barroso.org/wildlife.html)

[11] Google Mourns Veteran Engineer Luiz André Barroso, Who Invented the Modern Data Center, [https://www.wired.com/story/google-mourns-luiz-andre-barroso-veteran-engineer-invented-the-modern-data-center/](https://www.wired.com/story/google-mourns-luiz-andre-barroso-veteran-engineer-invented-the-modern-data-center/)
