---
layout: post
title:  "Securely centralized configuration with Spring Cloud Config"
description: "How to create a secure configuration server to centralize and externalize your configurations"
date:   2019-08-15 23:00:00
tags: [spring, security, microservices]
comments: true
share: true
---

Every software application needs some configuration: database URLs, passwords, usernames, links and such. If we think of single monolith applications, the first approach that comes to our minds is to store these configurations in some XML, YAML, properties file, or even in a database table where we can retrieve configuration at run time (dynamically). So whenever your project needs some new configuration parameter you can simply create it in your config file or insert it on the database table. But when we think of distributed architectures composed by dozens of micro services, managing configuration using this same approach is no easy task: if using simple config files, we would have to keep copies of them in every execution environment for each of our services. If using configurations stored in a database, we would have to map our domain in every service just for them to be able to use some simple configuration parameter such as "MYSQL_URL".

Modern distributed architectures demands for externalized and centralized configuration management. In a [twelve-factor app](https://12factor.net/config) configuration should be **independent** from code, **securely stored** and **available** so we can scale up without doing significant changes to tooling. This is what Spring Cloud Config helps us to achieve. It provides us support for externalized configuration offering a central place to manage external properties for applications that needs to consume it across different environments. As an application moves through the deployment pipeline, from dev to test and into production, we can easily manage the configuration between those environments and be certain that applications have everything they need to run.

In this post I will show you how to use spring cloud config to centralize configuration safely using symmetric key encryption.

> You can check the complete source code shown here in [this Github repository](https://github.com/andreybleme/discovering-spring-cloud-configserver).


Serving configurations
---

The first thing we need to do is to create the Spring application that will serve our configurations to be consumed by clients.

You can create a spring noot application anyway you want, but I strongly recommend you to create it from [start.spring.io](https://start.spring.io). You need to include the spring cloud config server dependencies: `org.springframework.cloud` and `spring-cloud-dependencies`.

In our main class, we must include the `@EnableConfigServer` to allow our application to expose configurations:

<script src="https://gist.github.com/andreybleme/a2941360d3a73577846323a14fe4b5ec.js"></script>

Now we need to specify where our configs will be stored. Let's use a git repository to store them, so we can take advantage of the version control system to track the history of our configs. Include the path of the git repository that will contain our configs in the `application.properties` file:

<script src="https://gist.github.com/andreybleme/e0f9b7807fe2c0f3e52939f54c28ccd6.js"></script>

Now we are almost done. The last thing we need to do is to create the config files that our server will serve. To do so, create a new git repository and create as many configuration files as you want. These config files can be created in a *.properties* format. See the `crazy-client.properties` containing a database URL:

<script src="https://gist.github.com/andreybleme/e5bac53da2965350a4b452b1e9417ccd.js"></script>

Now commit and push the config file `crazy-client.properties` to the remote server.

Having it done, we can now startup our application server as a common spring boot app (Run as Spring Boot App) and see if our configurations are being exposed:

![Spring cloud Config](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/config-server-server.png "Spring cloud Config")

> If you have created the git remote repository you should see a different value for the "name" key in the request result. In the above example the "name" is pointing to my local machine where I have created the git repository containing the configuration.

If everything was correctly setted up, the configuration can be properly accessed when we request for them accessing `localhost:8888/{application-name}/default`. 

By now, client applications can consume configs provided by our server application. Let's check how it can be done.


Consuming configuration
---

Let's now create a client application just to show how easy it is to consume configurations served by a config server. To present it, I have generated a new spring boot project at [start.spring.io](https://start.spring.io) and included the `org.springframework.cloud` dependency.

In order to allow the client application to read configurations from our config server, we have to add at the `bootstrap.properties` the URL of our server (my server is running at localhost:8888):

<script src="https://gist.github.com/andreybleme/f1c6708ab8471fa1207636af62e2b5e0.js"></script>

**Important:** The `spring.application.name` must be the same as the .properties configuration file you have created and pushed to you git repository. This is how spring cloud knows which configuration file the client application has access to.

Now to use the URL configuration key we have created, let's create a simple REST controller that prints the URL when the endpoint GET /database is called:

<script src="https://gist.github.com/andreybleme/43b05d2db64e50dbaa0956fce088cdec.js"></script>

 Here the annotation `@Value("${url}")` will make the magic and fetch the URL key at the config server. If everything works fine, when we make the GET /database request, we can see that the response is exactly the config key we have defined in our `crazy-client.properties` file:

![Spring cloud Config](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/config-server-endpoint.png "Spring cloud Config")

The same can be achieved with any client application built using any technology, not only java + spring boot apps.


Using environments
---

Sometimes we want different configuration depending on the environment our application is running (development, staging, production). To achieve such a thing using our config server is pretty easy: all we need to do is to create a file for each environment.

By now we have only the `crazy-client.properties`, as we have seen, we can retrieve the configurations contained there by accessing `localhost:8888/{application-name}/default`.  Let's create two different files now, one for development environment `crazy-client-development.properties`:

<script src="https://gist.github.com/andreybleme/291c7edc11fe6c77c04d399326a7bc84.js"></script>

And another file for production `crazy-client-production.properties`:

<script src="https://gist.github.com/andreybleme/f765c34bb413f82931263e62303e7bd1.js"></script>

After committing and pushing these new files to the git remote repository, we can see that the new configuration is being served for both development and production environment:

 
![Spring cloud Config](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/config-server-dev.png "Spring cloud Config")

![Spring cloud Config](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/config-server-prod.png "Spring cloud Config")


By now, whenever our client application starts up using the "development" or "production" environment, the configuration will be retrieved from the corresponding file. In order to test it, we must change the `spring.profiles.active` in the `bootstrap.properties` file of our our client application:

<script src="https://gist.github.com/andreybleme/694146a658640b58ea83a956e161909c.js"></script>

Now if we request GET /database endpoint, we receive the production URL in the response.

Adding security with symmetric key (JCE)
---

It is important that our credentials are not exposed. Even if the git remote repository have some access restriction with authentication, it is a very important security practice to **do not store plain text anywhere. Never.** If you still think that there is no problem storing plain-text in a secured git repository or database you should [read this post](https://arstechnica.com/information-technology/2014/04/why-should-passwords-be-encrypted-if-theyre-stored-in-a-secure-database/), and then [read this one](https://blog.codinghorror.com/i-just-logged-in-as-you-how-it-happened/).

So how can we protect our sensitive configuration URLs and credentials? We can encrypt them using a salt.

In order to secure our configurations using spring cloud config, the first thing we need to do is to install the Java Cryptography Extension (JCE). JCE is basically a set of APIs that allows the JRE to work with some cryptography and hashing algorithms. You can [download it here](https://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html). To install it, we just need to copy the downloaded JARs into our JRE installation path:

```
~/ sudo cp local_policy.jar US_export_policy.jar /usr/lib/jvm/java-8-oracle/jre/lib/security
```

Having the JCE installed, now we want to encrypt our sensitive data. The first thing we will do is to create a password that will be used as a salt by our hash algorithm. Add in the `bootstrap.properties` file at the server application, a `encrypt.key` value, such as:

<script src="https://gist.github.com/andreybleme/8b55fc786d342394ab607c4de643be29.js"></script>


> **Important:** If you do not want the encryption key to be stored as plain text, use an ENCRYPT_KEY environment variable.

Now we need to start the server application and perform a POST request for the endpoint /encrypt, by sending in the request body the content we want to encrypt:

```
~/ curl localhost:8888/encrypt -d postgres://andreybleme-dev:password123encrypteddev@andreybleme.com:5432/my-dev-database

3cad1441589b2bfb37c0e6127499222779a3e07ce07391...
```

Here I am encrypting the Postgres URL `postgres://andreybleme-dev:password123encrypteddev@andreybleme.com:5432/my-dev-database`, and getting in response the encrypted URL.

> **Tip:** If you get the error `{"description":"The encryption algorithm is not strong enough","status":"INVALID"}` when performing the POST /encrypt request, this is probably because your encrypt.key is in the wrong file. Make sure it is in the bootstrap.properties.

Having the encrypted URL, now we want to put it into our configuration file. To do so, we have to use the prefix {cipher} and then paste our encrypted value. The crazy-client-production.properties file will look like this:

<script src="https://gist.github.com/andreybleme/69fb6508e1d72c7b8ebab83e82c2681e.js"></script>

It is very important that the encrypted value is not embraced with quotes, so our server application will be able to decrypt this value when some client application request for it. And that's it. There is nothing else we need to do in our client applications, now we have our configs properly secured and stored encrypted in our git repository.

The encrypted key is automatically decrypted as we can see accessing the config endpoint:

![Spring cloud Config](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/config-server-secured.png "Spring cloud Config")


Going further: service discovery and security in depth
---

Externalizing configuration in a centralized storage not only makes much easier to manage and scale up configuration, but it is also the first step for achieving service discovery. Service discovery basically means that your applications should not know the exact location of all the services it needs to communicate with, it should only know its name and then a service discovery tool will find the service location/address/URL for you. It is achievable by registering the localization details from our applications at startup time in some service discovery tool. It is a broadly known technique that reduces a lot the responsibilities of a service and might be very handy when we are working with 10, 20 micro services or more. There are some good service discovery tools, such as [Netflix Eureka](https://github.com/Netflix/eureka) and [Consul](https://www.consul.io/) that works well with spring cloud config.

Talking about the security concerns of using spring cloud config, in most of the real world cases a simple git back-end with a symmetric encryption might be enough. If for some particular reason you need a more secure approach, use the [asymmetric key schema with a proper key store](https://cloud.spring.io/spring-cloud-config/reference/html/#_key_management). Spring cloud config also supports [Vault](https://www.vaultproject.io/) as back-end instead of git. Vault is a "secret manager", it is a tool that helps us to protect sensitive data by proving a lot of ACL options, password rotation, and a really fine-grained control over permissions and encryption. I strongly recommend spring cloud config + vault + HTTPS (of course) if you are really worried about security.


References and useful links
---

- [Spring Cloud Config Documentation](https://cloud.spring.io/spring-cloud-config/spring-cloud-config.html#_security)
- [Installing JCE With an Unlimited Strength Jurisdiction Policy - DZone Post](https://dzone.com/articles/install-java-cryptography-extension-jce-unlimited)
- [Service Discovery in a Microservices Architecture](https://www.nginx.com/blog/service-discovery-in-a-microservices-architecture/)
