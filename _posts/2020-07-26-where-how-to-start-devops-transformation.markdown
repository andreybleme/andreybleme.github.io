---
layout: post
title:  "Where and how to start the DevOps transformation journey"
description: "Tackling some uncertainties and reducing the risk of failing when starting a DevOps transformation journey within organizations."
date:   2020-07-26 19:00:00
tags: [devops, devops-journey]
comments: true
share: true
---

Starting a transformation is full of uncertainty. We often have in mind an ideal result we want to achieve, but it may be hard to visualize the intermediate steps we need to take to get there. Going into a [DevOps Journey](https://andreybleme.com/tags/#devops-journey) towards the transformation of organizations is no different, applying the Principles of Devops (link) is no easy task. How do we dice where to start the DevOps transformation? How can we maximize the chances of succeeding when applying the DevOps principles? How to demonstrate progress after changing our organization cultural practices?

In this last post of The Devops Journey series, I will elaborate more on how to start the DevOps transformation, trying to answer these questions giving my personal opinion on selecting the correct value stream to start with, designing your organization to better support your transformation goals and takeaways from case studies and self experiences.

I strongly recommend you to read the previous posts of the series before reading this one:

- [The principles of DevOps](https://andreybleme.com/2020-06-30/the-principles-of-devops/)
- [Deliver faster by using the DevOps Flow techniques](https://andreybleme.com/2020-07-06/devops-flow-techniques/)
- [Use Telemetry to amplify feedback and see problems as they occur](https://andreybleme.com/2020-07-14/use-telemetry-to-see-problems-as-they-occur/)

### Choose a value stream to focus on

The first thing we must address when thinking on starting a DevOps transformation, is to define: from where are we going to start it? This will define which people are going to be involved in further actions, and also the impact of such a transformation as well. You can think of a "value stream" as one project that composes your company product: the mobile app of your e-commerce, the back office dashboard of you SaaS, and so on. In this first step, we want to define our goals, what exactly we want to achieve by applying DevOps practices. These goals can be business related stuff, such as "Respond more quickly to customer's change requests" or engineering goals like "Reduce the number of production outages during heavy usage periods".

By understanding which value stream are going to focus on, and what are the goals, we are ready to plan the people that we'll need to involve, and how this transformation is going to impact our business. Having this setup, we also need to think of which [DevOps Principle](https://andreybleme.com/2020-06-30/the-principles-of-devops/) we will focus on: [The principle of the flow](https://andreybleme.com/2020-07-06/devops-flow-techniques/), [the principle of constant feedback](https://andreybleme.com/2020-07-14/use-telemetry-to-see-problems-as-they-occur/), and/or the principle of continual learning and experimentation. Depending on which value stream we choose to focus, we can combine the techniques from different DevOps principles to achieve our goals, but it's important to keep in mind which techniques from these principles are we going to adopt to make sure we reduce our chances of failing, where failure, can be understood as a low value perceived after the transformation effort, we want to avoid this at all cost.

### Expand the culture across the organization

In every organization, we often find teams and individuals that are more open to adopt attitudes toward the adoption of new ideas. When starting a DevOps transformation, we want to make these innovators and early adopters to be on our side, and help us to adopt the DevOps practices that they already believe will improve their daily job:

![Tech adoption curve](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/adoption-curve.png)

Image source: [Where are you on the Teal Adoption Curve?](https://medium.com/going-teal/where-are-you-on-the-teal-adoption-curve-bf7a4d0742ad)

Mainly in the early stages of our DevOps transformation, it's a good idea to avoid spending much time trying to convince the more conservative groups. Instead of doing this, we will focus on creating success cases where we can demonstrate the benefits of adopting these new practices within less risky projects and teams. This is especially useful for situations where we face resistance from directors and important people who are responsible for taking the "no go" decisions. By starting with the most innovative groups, we can spend our energy on demonstrating the real value of the transformation and then expand these practices to our organizations, instead of going to the "big bang" approach, where some people often tries to start the transformation from everywhere, all at once. 

Having the early adopters on our side building the blocks to go further, we now can **build a critical mass** and what we call a **silent majority.** We are now capable of creating a stable base of supporters, by working with the teams that are more open to our ideas, even if they are not the most visible ones within the organization, we expand our level of influence by having adopters and success histories. This is pretty important to bypass political battles that could hold back our initiative.

### On creating a dedicated transformation team 

A frequent question that arises when we think of starting a DevOps transformation process, is "Should we create a dedicated transformation team?", and to answer this question there are a few important things you should take into consideration, let's elaborate a bit on them.

Depending on the size of your organization and the complexity of the product or product you are trying to transform, you will hardly find one single person that knows all the changes that need to be done to create value for the final customer. the required work to achieve this will be performed by multiple people from different teams and departments, so after identifying the members of a given value stream, we need to gain a clear understanding of how work is performed. To do so, we can document this is what is known as a value stream map.

![Value stream mapping](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/value-stream-mapping.png)

Image source: [The Most Important Tool in DevOps: Value Stream Mapping](https://sdtimes.com/devops/the-most-important-tool-in-devops-value-stream-mapping/)

In many organizations this value stream map is composed of hundreds of steps, requiring work form thousands of people. Our goal on creating this document is not to spend days or weeks documenting every single step of work we do, but to get sufficient knowledge on the areas in on value stream that can be possibly creating short lead times, and then we can address the correct people capable of changing their portion of the valures team. As a personal advice when mapping your value stream, I would suggest you to have a careful look on places where work needs to wait for weeks, or months to be started/released, such as approval processes and reviews, and places where rework is generated such as requirement changes during the development phase.

So getting back to our initial question on whether should we create a separate team to lead the transformation efforts, I would say that it depends on your goal. If you want to reduce the lead time of work that really needs to be done, you may have to put more people to work on specific portions of your value stream. On the other hand, if you need to generate more income, by reducing outages in a specific situation, you will maybe only need to change the practices of people that are already working on the given product you want to improve, instead of putting new people to work on it.

Having this said, if you decide to create a specific team for the transformation, there are some other things to keep in mind. First of all, the team members must be assigned to perform DevOps transformation practices 100% of their time. If you wanted people to be doing stuff not related to the transformation at the same time, you better assign people from the regular teams to be like "working on DevOps things for 20% of their time". If possible, create a physical space for the dedicated team, this can maximize communication and can create an isolation from the rest of the company, resulting in a more productive work, making the transformation team to be free from the rules and policies and rules that restrict the rest of the organization, as said in The DevOps Handbook: "established processes are a form of institutional memory. We need a dedicated team to create the new processes and learning required to generate our desired outcomes, creating new institutional memory". After the dedicated team has finished performing the necessary changes, or defining the new processes, it may be a good idea to allocate these people to be members of the organization teams that will be impacted the most by these changes. This can decrease the delay between work expended and improvement realized, which strengthens the feedback loop and helps to reinforce the desired new behaviors.

### Designing the organization to support transformations

Now that we have established our shared goals and organized the team to perform the best practices on the dedicated transformation team, we now need to think about how to organize ourselves on our daily work to best achieve our value stream goals.

Dr. Melvim Conway performed a very famous experiment in 1968, where he observed that "organizations which design systems, are constrained to produce designs which are copies of the communication structures of these organizations. The larger the organization is, the less flexibility it has, and the more pronounced the phenomenon". In other words, we can say the way we organize our teams has a powerful effect on the software we produce. In order to achieve our DevOps goals, such as [having a fast flow from Dev to Ops](https://andreybleme.com/2020-07-06/devops-flow-techniques/), we must design our organization in a way that allows people to work independently and safely, instead of having them all waiting for each other's work to be done to start theirs.

To give a quick glance at some interesting styles of organizational archetypes, we can highlight: 

- **Functional-oriented** organizations, that optimize for expertize and division of work, reducing costs. This kind of organizations focus on centralizing expertise, helping to enable career growth, and in the training of development skills. This has been the main method of organization for Ops teams for years: database admins, network admins, server admins, and so on, all organized into separate groups.

- **Market-oriented** organizations, on the other hand, optimize for responding quickly to customer needs. They usually have a flat type or hierarchy, composed of multiple cross-functional disciplined groups, containing people from engineering and marketing for example. This is how many organizations adopting DevOps tend to operate. In some cases, the service teams are even responsible for both feature delivery and service support.

The marked-oriented organizations where I have worked, strived for having small teams that were not only responsible for feature development, but also for testing, securing, deploying, and supporting their service in production. These teams are capable of conducting user experiments, to monitor their own application and thus, to move faster. Many people tend to think that to achieve market orientation, we need a large top-down reorganization, which ofter creates fear and a large expectation on disruptiveness. Instead, we can embed the functional engineers and skills into each service team, like creating new product teams composed by developers, QAs, designers, and security engineers. This gives more autonomy to service teams and we can be free from processes like opening tickets with other groups such as IT operations, QA, and Infosec that needs to approve something to allows our team to move forward.

----

[These are the notes](https://andreybleme.com/tags/#devops-journey) I can provide you on some important issues you may need to address when starting your DevOps transformation. There are many more challenges and things that were not discussed here, but the idea was just to highlight the things that I have seen happening recurrently and we still struggle to understand and take actions into the "less incorrect" direction.

I was thinking on a final thought to close this DevOps Journey series, and then I have found on The DevOps Handbook conclusion, the perfect summarization of what I think you should have in mind when going further into your own career by applying the DevOps principles and adopting the culture:

> "The people involved in these transformations (DevOps transformations) knew upfront that what they were doing had a high chance of failure, and they did it anyway. In doing so, perhaps most importantly, they inspired the rest of us by showing us what can be done. Innovation is impossible without risk-taking, and if you haven't managed to upset at least some people in management, you're probably not trying hard enough. Don't let your organization's immune system to deter or distract you from your vision."

I hope this DevOps Journey series of articles helped you somehow.

If you liked this post, consider sharing it.
