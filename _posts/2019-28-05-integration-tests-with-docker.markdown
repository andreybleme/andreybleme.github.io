---
layout: post
title:  "Integration tests with Docker"
description: "A more maintainable way to provision and manage the lifecycle of the dependencies that your application needs to run integration tests."
date:   2019-05-28 20:00:00
tags: [docker]
comments: true
share: true
---

I have recently engaged into a new project. Once again, I thought tests were a solved issue given the big existing code base. Unfortunately, we have different repositories built with the same technology stack, each containing a different setup strategy for its integration tests (aka: a mess). Maybe unity tests can considered a solved issue. In the last years we have seen a lot of people talking about TDD and BDD, and I think that unity test frameworks evolved a lot, we have a great ecosystem of tools for mocking as well. But with applications getting more and more complex, nowadays we have too many integration points and cannot rely on having only unity tests.

![Modern architecture](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/modern-aws-architecture.png "Modern architecture")

So if you want to have automated tests that really make use of all your components, keep in mind that the "mock everything" was is over. 

**Important:** I'm not saying that unity tests are not important. You should do it. Implement unity tests for your business logic and make sure it works with automated tests. I'm just highlighting the challenges of building maintainable integration tests and some of the reasons why you should care about it.

Integration tests are extremely valuable but very hard to maintain and to write. Here I will share some insights from my own experience using Docker containers to build more maintainable integration tests.

How Docker Can Help
----

Since integration tests require real components to be used, we need to be able to easily create and destroy new components of our application on the fly, so it can be part of a isolated environment only used by our tests. That's basically what Docker containers are about.

So a good idea might be to create Docker containers before the execution of our integration tests, and after they are finished we can destroy them. Let's take as an example an application that has a CRUD feature that has to be tested with a real Postgre database instance and a Redis for caching: first we run a postgre container with a volume, then we can execute the integration tests that will use this container. As soon as our tests are finished we stop the database containers.

Seems to be a good idea. The easiest/fastest way to do this is by creating a bash file that will manage our container creation and destruction by running Docker CLI commands:

<script src="https://gist.github.com/andreybleme/a09098ef5b32e4ae1703e1e12ab2ab1f.js"></script>

In order for this to work, we need to explicitly execute this `db.test.sh` script whenever our tests run. 

It's a point of start, but it doesn't give us the control we want to start and stop containers programmatically, nor allows us to orchestrate the life cycle of different containers that needs to be started only for some particular tests scenarios. We could also use docker compose to spin our containers by running (`docker-compose up`) and then execute a `make test` following the same idea from our shell script. But we would still face the same orchestration issues.

To find a better approach, let's revisit the Docker architecture concept:

![Docker architecture](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/docker-onion.png "Docker architecture")

As software developers we often tend to think that the CLI must provide all the resources we need to take the full potential of Docker. But remember: Docker has an API. Not everything needs to be done through the CLI. With this in mind, we can choose a SDK for our favorite language to programmatically provide our containers while running our integration tests:

<script src="https://gist.github.com/andreybleme/f383950338bda9a399e99839735cb39a.js"></script>

Now we can have a more fine grained control of our containers orchestrated according to our needs, and the best part: it is together with our test code, so we have the setup and the execution of our integration tests together. Way more maintainable.

Still, using a Docker API SDK may lead to some cognitive overhead in our test code. If you need to perform authentication, execute entrypoints or CMD commands i some of the containers used on the tests, our code can easily become very confusing. Fortunately developers out there felt the same about using Docker API SDK to setup integration tests and created [testcontainers](https://github.com/testcontainers).

Using testcontainers
----

Testcontainers is a library that supports anything that can run in a Docker container. It's basically a Docker API wrapper optimized for testing purposes. It has [implementations for many languages/runtimes](https://github.com/testcontainers) (Java, Node, Go, Rust, .NET and Python). 

Testcontainers provides us some great features that makes easy to setup integration tests using Docker containers. Let's see testcontainers in action in a Node test class writen using Jest:

<script src="https://gist.github.com/andreybleme/2f3c50b0ded2ab1ee9920bfcbe861381.js"></script>

Before the test execution begin, we start a Postgre container at the `beforeAll()` method. This enables us to perform our write and read operations using a real database. We also need to get the port exposed by the new container with the method `pgContainer.getMappedPort(5432)` at line 18, so we can build the Database access URL `PG_URL` by using the exposed port (we can only know which port will be exposed after the container starts). At line 21 I'm using [Knex](https://knexjs.org/) to run a migration on my brand new database container, so I create my database schema whenever this test class is executed. After the tests finished running, we can destroy the created schema and stop the container by using the `pgContainer.stop()` method.

Another tricky thing that was necessary to do here, see line 18: when we create a new container, we want our application to use it instead of using the regular one, used when the application is running in a non-test environment (local, staging or production for example). So I had to change de `PG_URL` environment variable to point to the new container URL. If we don't do this, the queries of our application will try to access a postgre database different from the one we created using testcontainers. Make sure to have you application running using the URLs of the new containers you have created during your test setup, otherwise, you won't be able to run your tests and you will probably face database access failure issues.

----

Performing integration tests may require a painful setup. Using docker API may not have been thought as a first choice till now. Maybe because of the misleading mindset that the CLI should provide everything we need, or because using Docker API SDKs might require some lengthy setup code. Testcontainers is a ready to use tool, have a great community support and provides interesting features to help us to create integration tests. I haven't seen many people using it around, so I hope my experience can inspire you to use it in your own integration tests.


References and useful links
-------------

- [Testcontainers documentation](https://www.testcontainers.org/)

- [Testcontainers Slack group](http://slack.testcontainers.org/)

- [Dockerize your integration tests](https://medium.zenika.com/dockerize-your-integration-tests-8d26a7425baa)

- [DockerCon 2019 Talk - Write Maintainable Integration Tests with Docker by Gianluca Arbezzano](https://speakerdeck.com/gianarb/dockercon-2019-write-maintainable-integration-tests-with-docker)
