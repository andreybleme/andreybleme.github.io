---
layout: post
title:  "Securing Vuejs applications with Access Control List"
description: "Creating an Access Control List to secure your Vuejs application routes."
date:   2020-01-11 14:00:00
tags: [security, javascript, vuejs]
comments: true
share: true
---

An important piece of every software application is its permissions. As software developers, we should be able to easily forbid or allow users to perform actions in our software. We can achieve this by creating an ACL (access control list) and adding an extra security layer to handle authorization verification.

There are many ways to implement ACL mechanisms. Here I'll share one very common and effective approach to implement this on Vuejs applications.


Overall solution
---

What we want is to build a solution to **store** the name of the features that we want to allow or forbid for any specific user, role or group of users, and **test if** a user is allowed to perform a given action when it tries to do it, by checking our stored list of actions allowed.

To accomplish that, we'll store a list of `disallowedRoutes` in our database, and this is going to be related to a `user role`. So our permissions data structure will be stored like this:

```
role: reader
disallowedRoutes: ["admin", "createUser", "updateUser"]

-

role: admin
disallowedRoutes: []
```

Here we have two roles: "reader" and "admin" with the routes we want to forbid. As you can see, users with the role "admin" won't have any restrictions, they are allowed to access all the routes of our app.

So now, let's take a look at how to control the access to each of its routes when users are navigating in our application.


Check permissions using vue router
---

Using the vue router is the official tool to handle routes in vuejs applications, so here I'll show how to check for permissions using it.

What we in our router, is a mechanism to check if the authenticated user is allowed to navigate into the route he wants to, and only redirect if he is not forbidden to do so. We can easily accomplish this by using the `beforeEach` navigation guard, which allows us to execute some piece of code before each route redirect.

So, before each redirect of our router, we will check if the user is allowed to navigate into the given route. If not, we will redirect him into some default route:

<script src="https://gist.github.com/andreybleme/2120447feb729cdd0b351793950d690f.js"></script>

Le'ts focus at the important things here, between lines **17** and **29**.

We perform an API request to get the user permissions: `await  api.getPermissions(user.role)`, and then we sore the disallowed routes in our application state. Here I'm using the [Vue Observables API]([https://vuejs.org/v2/api/#Vue-observable](https://vuejs.org/v2/api/#Vue-observable)) as a state management tool, but it could be [Vuex]([https://vuex.vuejs.org/](https://vuex.vuejs.org/)) or a simple local storage as well, it doesn't matter.

> Here is the content of the observable, just to give you an idea about how simple it can be to manage state using it:

<script src="https://gist.github.com/andreybleme/a52f3ae935da45a5f0de3ebadaca8008.js"></script>

Back to our `index.ts` file: after having the disallowed routes stored for our given user, at line **24** we check if the user is trying to access a route that is disallowed: `if  (store.disallowedRoutes.includes(to.name))`. Here the `includes()` javascript function will return true if its given parameter (to.name) is present at our `store.disallowedRoutes` array. If the **user is disallowed** to access the given route, we redirect him into a default route: `next({  path: defaultRoute  })`, (our default route is `/home`). If the **user is not disallowed** (that is, if he is allowed), we simply redirect him into the route he requested by calling the `next()` function at line **27**.

It's important to notice that our entire code is at the `beforeEach` navigation guard, so it will be executed for every single route redirect of our app. We don't want to perform an HTTP request to get users permissions all the time, so we added the extra conditional here at line **8** to avoid this: `if (!store.disallowedRoutes)`, that means we only perform the API request if we haven't the permissions stored.


Things you should be aware of
----

On this proposed solution, we are storing the actions that users are **not allowed** to perform. So as your application grows, you need to constantly update your database to make sure new features are being blocked for some of your user's roles. What are the implication of using a **blacklist** approach? Of course, you can alternatively use a **whitelist** approach and store all the actions that **users are allowed**. By going this way, all your future application features would be blocked by default if you don't explicitly store the name of the new action in your database.

I don't think there is a better or worse approach here, but there are some trade-offs: if you create a blacklist ACL mechanism your storage tend to be more lightweight, since you will probably store less records that you would if you had to store all the actions allowed for each role, as we make when whitelisting. But, the whitelist approach follows a **secure by design** principle, that can make you feel more comfortable knowing that no new route will be allowed by mistake if someone forget to explicitly block it. It's up to you to decide which approach fits better in your context.

P.S We are only covering frontend security here. Your APIs should be secure as well. So make sure you use [JWTs for authentication]([http://andreybleme.com/2017-04-01/autenticacao-com-jwt-no-spring-boot/](http://andreybleme.com/2017-04-01/autenticacao-com-jwt-no-spring-boot/)), you defined [rate limits]([https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/](https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/)), you have a decent [CORS policy]([https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/](https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/)), you use a good [WAF]([https://www.owasp.org/index.php/Web_Application_Firewall](https://www.owasp.org/index.php/Web_Application_Firewall)), and if you can, use a [reverse proxy mechanism]([https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/)) (API gateway, load balancer, varnish, NGINX).


References and useful links
---

-  [Authentication best practices for Vue](https://blog.sqreen.com/authentication-best-practices-vue/)

-  [VueJS Route Permissions, Security and Admin Section](https://serversideup.net/vuejs-route-permissions-security-and-admin-section/)

-  [Using Vue Observable as a State Store](https://dev.to/cooperaustinj/using-vue-observable-as-a-state-store-37fa)

