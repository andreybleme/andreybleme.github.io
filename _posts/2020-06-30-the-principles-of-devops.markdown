---
layout: post
title:  "The Principles of DevOps"
description: "Introducing the 3 principles of the DevOps culture, that allows us to deliver software faster and safer, creating a safe system of work with a hight trust culture."
date:   2020-06-30 19:00:00
tags: [devops, devops-journey]
comments: true
share: true
---

I have been recently talking to friends about processes and things we often focus on at our works to improve our daily job. It seems to me that every developer has a strong desire to be able to say that they work on a company that ships good code, with high quality, that the company they work for can deliver features fast. They want to feel safe that things they are building will go to production, and so they can see the outcome of their work. Given that scenario, I realized that we get ourselves too often attached to technologies and tools that help us to achieve these goals, when we should instead, focus on practices that enable agility, high quality, and increase safety and confidence in our software release processes.

That's why I have decided to start [The DevOps Journey](https://andreybleme.com/tags/#devops-journey) series of articles here, where I will post every week one "pill" that will help you to understand how to improve your outcomes and increase the effectiveness of you daily work by applying DevOps techniques. There are a bunch of articles, videos, and talks around there describing the principles, the practices, the path through the DevOps journey... This series is about my own thoughts that is defined by my influences(The DevOps Handbook, SRE, Continuous Delivery book series, Hello Startup), and mainly my daily work. Starting today with an overall introduction to the principles of DevOps, The DevOps Journey series of posts are going to be released every week, [stay tuned](https://andreybleme.com/tags/#devops-journey).


DevOps and its resulting technical and cultural practices represent a convergence of many philosophical and management movements that guides us through the path to overcome important challenges that come with the desire of being able to deliver fast and reliable code.

![DevOps principles](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/devops-principles.png)

Today I' will elaborate toward the 3 DevOps principles that enable us to:

- Enable fast flow of work, from dev to ops, to customer(end-user).

- Achieve reliability and amplify feedback creating a safe system of work.

- Create a hight-trust culture that integrates continual learning into the daily work.

At the end of this article, you will be able to identify which of these principles you should focus on, to strive for the greatest software outcomes, and the delight of your everyday work. So let's check the 3 principles of DevOps.


The principle of the Flow
---

This first principle, known as the principle of the flow, focuses on practices that enable fast left-to-right flow of work. That means: from the development stage into the production environment.

In order to maximize flow, we need to make work visible, reduce the batch sizes and intervals of work, build in quality by preventing defects from being passed to the next stages of the workflow using automated tests, and integrating them into our deployment pipeline. By speeding up our flow, we reduce the lead time required to fulfill our customer or internal requirements, especially the time required to deploy code into the production environment. By doing this we boost our throughput as well as our quality since we will increase our trust by working on a system that is safe to change.

To enable it, we should adopt some practices: Continuous build/integration, automate test and deployment processes, allow developers to create production-like environments on-demand, and limiting the amount of work in progress(one-piece flow). It all seems to be easy to adopt, but as you can imagine, these are practices that require significant changes in the way you are probably working today, and just like any important change, it requires us to know where to start and how to keep evolving taking smart steps.

You should focus on embracing the practices from the principle of the flow whenever you feel that you are taking too long to deliver working pieces of software at your production environment when you feel that the amount of bureaucratic work that needs to accomplish before you can see your work advancing into production is too high, and of course, when the quality of your releases seems to be often not good enough (with too many defects or non-functional issues).

We will approach the technical practices of the flow in another article, where I will dive deeper into how you should create the foundations of your deployment pipeline, integrate automated tests into your workflow and architect for low-risk releases.


The principle of Constant Feedback
---

Having already increased our effectiveness on moving code into production, we now want to make sure that we are able to see what is happening with our software when people are using it, how it behaves in a real production environment. The principle of constant feedback says we should be able to see the problems as they occur, we must amplify feedback from our software to prevent problems from happening again and enable fast detection of issues, so we can act before customers can notice.

To achieve this we must create telemetry into our systems, to be able to see and solve problems based on real data, not on people guesses. When focusing on this second principle, it's important to analyze the best metrics we want to track to make sure we have information not only for engineering teams, but also for operation folks: developers may be interested in getting information about the number of login failures during a specific time period, server CPU usage during a peak and such, but operations teams probably will not take advantage of these data. Instead, operation teams would greatly benefit from data such as the amount of time users used a specific feature that enabled a sell(transaction). This is a simple example that shows us the importance of well analyzing how to include telemetry into our systems instead of simply integration tools into our software.

To increase the quality of our work we should create review processes, by adopting code review practices, pair programming, and peer reviews. These practices are going to be discussed further in detail, but by now, you already have a good idea of duties you should focus on if you want to be able to go serious into running software in production.


The principle of Continual Learning and Experimentation
---

This last principle is the one that approaches the practices that enable us to inject learning into our daily work. It seems obvious and redundant to say such a thing, but we will simply never get an environment of high trust and constant learning if we don't separate time to transform local discoveries into global improvements. Conduct post mortems, create relevant documentation, and performing regular retrospectives will allow us to cumulate collective experiences of everyone in the organization.

It's easy to forget about doing such things, but as we will discuss in another post, there are many ways to strive for achieving this the right way and including this into our daily work.

Why it is important that you keep these principles in mind
-----

I feel like these days people are too focused on tools and technologies that they cannot see the big picture. When joining a new company or when thinking about ways to improve our daily work and our outcomes, getting to know these DevOps principles is a must to allow us to understand where is our product/organization on this DevOps journey. By understanding the 3 principles you can be way more accurate on providing insights to your teammates on where you are, and where you would like to be in the future in terms of maturity and agility.

Understanding your context, being able to pragmatically suggest actions and changes in practices that affect our everyday work is a highly valuable characteristic that may distinguish you as a developer. Once you get the point of where you should focus the efforts on, then you can move on to understand which tools and technologies are out there to help you achieve your goals, depending on which of the DevOps principles you want to focus on.

If you liked this article, consider sharing it.
