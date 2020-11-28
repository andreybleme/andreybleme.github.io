---
layout: post
title:  "Running Cypress end-to-end tests in parallel using AWS Codepipeline CI"
description: "Implementing an AWS Codepipeline for running end-to-end tests with AWS Cloudwatch scheduled events"
date:   2020-11-28 19:00:00
tags: [devops]
comments: true
share: true
---

Running end-to-end tests can be thought. As your test suite grows, the time spent for running the entire test suite grows, so does the amount of computing resources consumed in this process.

A few months ago I have shared here some tips on [how to run end-to-end tests from Cypress in a CI pipeline from Github Actions](https://andreybleme.com/2020-02-29/continuous-Integration-with-github-actions-and-cypress-end-to-end-tests/), and for about 4 months this solution worked pretty well for our team: every time a developer creates a pull request, the Github actions check is triggered and the CI runs all the specs. But as you can imagine, when the amount of specs started to increase (to an amount near 300) the time spent for running all the tests started increasing, and more important: the money spent for running this pipeline increased drastically. Since we are running all tests in parallel, the time aspect of this constraint is tolerable (no more than 15 minutes), but the money is not. Running our e2e tests in Github actions every time a new PR is opened, would cost something near 150 USD/monthly.

Here I will show you a strategy you can implement to work around this linear, endless time and money consumption that grows along with your e2e test suite. It worked pretty well for my team, and hopefully, it helps you too.

### Overall Solution

Instead of running all the e2e tests for every created pull request, we will create a pipeline that will be triggered once a day, to run the entire integration test suite at night. This pipeline can be executed by any CI server out there (Jenkins, CircleCI, Drone etc), but here I will show you the step by step to run Cypress e2e tests in parallel mode using **AWS Code Pipeline**.

To invoke our pipeline, we will create an **AWS Cloudwatch** event that will work as a cron job, triggering the pipeline every day at 10 PM UTC. Both the pipeline and the Cloudwatch event are going to be provisioned through **Cloudformation**, the AWS IaC tool.


### Create the Code Pipeline

Code pipeline is the AWS CI tool, it allows us to create flexible pipelines with many different steps. Here we will have a pipeline with two simple steps:

**1.** Clone our Github repository

**2.** Run the Cypress e2e tests

Where the second step will be composed by the processes:

**1.** Install the project dependencies

**2.** Authenticate Cypress into Cypress dashboard using its secret and access keys (this is required so we can check the test execution results at [dashboard.cypress.com](https://dashboard.cypress.io/) with video records and screenshots)

**3.** Startup the frontend application

**4.** Run the Cypress tests against it

The cloud formation template to provision such a pipeline looks like this:

<script src="https://gist.github.com/andreybleme/2a376e9211191c837462154e5296b226.js"></script>

Line 153 is the one that defines the steps (stages) of our pipeline. It starts with the Github integration ("source" stage at line 173), where the pipeline will get the code from, and then it is followed by the Codebuild stage that will run our tests ("EndToEndTests" stage at line 189).

>  The flag `PollForSourceChanges: false` from line 187 is necessary to avoid this pipeline to run at every push event that happens in the Github repository. If you don't set it to false, the pipeline will be triggered in every push event. Since we only want this pipeline to run at the end of the day, we are disabling the webhook by setting this parameter to false.

By giving a deeper look at the "EndToEndTests" Codebuild project at line E2EGroup1, starting at line 69, we can see it starts with some configuration definitions such as the Linux image from the CI instance, and the artifact that this code build will interact with, coming from the previous "source" stage. The most important part of this "EndToEndTests1" Codebuild project is the "BuildSpec" defined at line 102:

<script src="https://gist.github.com/andreybleme/41d5b357a34504437b90f98f28dbd34f.js"></script>

Here we define the Node 12 runtime, install all the project dependencies (in this case it's installed with the `npm install -g typescript lerna`, but it could be anything like `maven install`), then we are exporting the Cypress access and secret keys as environment variables (lines 13 and 14) to allow Cypress to store the screenshots and record the test execution at [dashboard.cypress.com](https://dashboard.cypress.io/).

At line 22 we simply start our frontend project, using wait-on to make sure our execution environment will wait until the app is available at localhost:8080 before running any other command. After that, we have at line 25 the execution of the e2e test itself, with some important parameters:

- `--record --key=${CYPRESS_RECORD_KEY}` used to record our tests and upload it to the Cypress dashboard.
- `--parallel --browser electron` used to indicate our tests will run in parallel, in electron browser.
- `--ci-build-id $BUILD_TAG --headless` the build tag here has a unique value for our 2 Codebuild projects, allowing Cypress to group the multiple parallel test executions into the same logical test execution, as described in [Cypress parallelization docs](https://docs.cypress.io/guides/guides/parallelization.html#Linking-CI-machines-for-parallelization-or-grouping).
- `--tag "nightly"` this is used to create visual evidence at Cypress dashboard that the results are coming from this specific CI execution, this is useful when we have multiple clients running Cypress tests as we will see later.

This is all we need for our pipeline to run 2 instances executing all our e2e tests in parallel, sending the results to our Cypress dashboard. Note that we need to create a new Codebuild project for each new instance we want to share the workload: `E2EGroup1` and `E2EGroup2` in our case but you could create `E2EGroup3... E2EGroup10`, to make the tests to run parallelly in 10 instances.

Now let's create the Cloudwatch event that will trigger this pipeline once a day.


### Create the Cloudwatch event

The Cloudwatch event consists of a scheduled event that will run according to a UNIX cron definition. The Cloudformation code to provision this event that will trigger our already created pipeline looks like this:

<script src="https://gist.github.com/andreybleme/85d16965af89a6d3cc45776f9d170e2e.js"></script>

The `Target` attribute in line 7 creates the link between this event and our pipeline, this is what makes our pipeline to be executed when the `ScheduleExpression` is satisfied. The `ScheduleExpression` contains the UNIX Cron expression for defining the date and time that this event must be triggered (every day at 22 PM). Check [Crontab Guru](https://crontab.guru/#0_22_*_*_*) to see the proper syntax for other patterns.

It's also important to mention that the `RoleArn` defined in the `Target` of this event definition must be an IAM Role with the proper authorization policies to interact with the AWS resources: code build, code pipeline, code start, and cloud watch. To see how to create this Role access the [IAM Roles docs](https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_service-with-iam.html).

---

Having a scheduled event for running all your end-to-end tests might be a good solution if you want to save costs and still keep track of your overall quality.

By the end, your pipeline will look like this in the AWS console (ignore the fact I'm using 10 Codebuild instances instead of only 2 as shown during this post):

![Code pipeline e2e tests](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/aws_e2e_pipeline.png)

And you Cypress dashboard will display the results with the "nightly" tag:

![Cypress Dashboard](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/cypress_dashboard.png)


If you liked this post, consider sharing it.
