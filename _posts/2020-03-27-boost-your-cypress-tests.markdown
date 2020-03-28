---
layout: post
title: "Boost your Cypress end-to-end Tests"
description: "4 simple tips to improve the speed and the maintainability of your cypress tests."
date: 2020-03-27 22:00:00
tags: [devops, javascript]
comments: true
share: true
---

I have been working with cypress recently, and every day I learn new stuff about it.

In the previous post I have shared [how to configure continuous integration with Github actions and cypress](https://andreybleme.com/2020-02-29/continuous-Integration-with-github-actions-and-cypress-end-to-end-tests/)

Now I will share some tips and tricks that may help you to boost the performance and the maintainability of your cypress tests.
  

Parallelize the execution of your tests
-------------

First things first: we all know that these e2e tests take a really long time to run take here as an example of my 169 spec tests:

![Cypress test taking too much time](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/tests-taking-long-time.png "Cypress test taking too much time")


Wait 57 minutes for your tests to run at the CI is simply unacceptable.

Fortunately, cypress provides great integration with the most popular CI tools to parallelize the execution of our tests. Here is how to do this with Github Actions: make sure you are using the [official cypress GitHub action workflow](https://github.com/cypress-io/github-action), and add the `matrix` strategy in your job configuration specifying the number of containers you want the CI to spin up to run all your tests:

<script src="https://gist.github.com/andreybleme/84c92626835e3245d8b6b4a8604e17f0.js"></script>

Here on my workflow file I'm running 10 containers so my tests can run really fast. See the results after adding this simple configuration:

![Cypress test running fast](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/cypress-tests-fast.png "Cypress test running fast")

From 57 minutes to less than 7 minutes. Awesome!


Wait for complete server startup
-------------
It's important to guarantee that the application being tested is up and running before you cypress test starts to run. Otherwise you may face annoying and nondeterministic timeout errors:

![Cypress test timeout error](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/cypress-test-timeout.png "Cypress test timeout error")

This kind of error happens when we try to reach a URL `cy.visit('http://localhost:8080');`, and the server `localhost:8080` is still not ready.

To avoid this, use the [wait-on npm module](https://github.com/jeffbski/wait-on). Wait-on is a npm command line utility which will wait for files, ports, sockets, and http resources to become available. To add this at our cypress tests workflow at Github Actions CI is pretty simple:

<script src="https://gist.github.com/andreybleme/5dbd3d2aba8ce88039689055ce9b3c95.js"></script>

At the `build` step phase, we install the wait-on npm package. After that, we just ask wait-on to wait for the URL `localhost:8080` and set 2 minutes as a timeout for waiting `wait-on-timeout: 120`. This should be enough to fix all sorts of nondeterministic timeout failures.


Change cypress default timeouts
----
All cypress commands have a default time, in milliseconds, to wait until most DOM-based commands to be considered timed out. If you have some components that may take a bit long to load, such as selects and menus, you should consider changing the default timeout. To do this, you simply need to add at the `cypress.json` file the new timeout you want to set:

<script src="https://gist.github.com/andreybleme/c1f7e7f689eba16258528fa8f6b48605.js"></script>

The `defaultCommandTimeout` affects commands that manipulates DOM: `cy.get()`, `cy.click()`and such.
`pageLoadTimeout` is the time, in milliseconds, to wait for `page transition events` or [`cy.visit()`](https://docs.cypress.io/api/commands/visit.html), [`cy.go()`](https://docs.cypress.io/api/commands/go.html), [`cy.reload()`](https://docs.cypress.io/api/commands/reload.html) commands to fire their page `load` events.


Use Cypress commands to avoid boilerplate code
----
Some of the code you write may repeat for all over your test code. Take as an example a autocomplete component that receives an input, and loads a list of filtered options above it. If this component is everywhere on your application, you may have to do this a lot:

<script src="https://gist.github.com/andreybleme/a70eadc1ef805570dd5cdc99167bc884.js"></script>

To avoid typing all these, we can create a cypress command that will encapsulate this boilerplate code. To do so, let's edit the `/cypress/support/commands.js` file:

<script src="https://gist.github.com/andreybleme/29e71b5acd0be96348b13c47da4deac3.js"></script>

This allows us to write way simpler interations with the autocomplete component at our tests:

<script src="https://gist.github.com/andreybleme/a70eadc1ef805570dd5cdc99167bc884.js"></script>

These commands may be pretty useful for DOM interactions that require too much code. So don't be afraid of adding new custom commands.

---

Cypress offers us a ton of configurations and useful customizations, It is up to us to choose the ones that better fit our scenarios and make our tests more clean and fast.
  

If you liked this article, consider sharing it.