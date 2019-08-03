---
layout: post
title:  "Sharing data across Vuejs components"
description: "Some easy approaches to share data across components built for Vuejs small and medium applications."
tags: [javascript, vuejs]
date:   2018-01-07 20:00:00
categories: javascript
comments: true
share: true
---

When creating VueJs components, there are always concerns about how they can communicate with each other. With that in mind, let's see some different approaches for solving this problem.

> **If you want the complete source code, check [this Github repository](https://github.com/andreybleme/discovering-vuejs2/tree/master/communicating-between-components).**


Passing data through props
-------------

A very easy way to pass data to a component is using properties (props). Every Vuejs component instance has it own isolated scope, this means we cannot directly access any parent data in a child component. Data can be passed down to a child component using props. 

**Props** is a custom Vuejs attribute for passing data from parent components to child ones. **This is very important to remember:** you won't be able to share data across components using props unless your intention is to pass the data from a parent to a child component.

The child component needs to declare the props it expects to be passed from a parent component:

<script src="https://gist.github.com/andreybleme/63017a0690fd527723c337788afe17ee.js"></script>

Here we expect a property named "myName". As you can see on line 4, props support an object as a property to provide some data validation, such as: data type (String, Number, Object or even a Function), requirable and default values. You can [see complete props validation options here](https://alligator.io/vuejs/property-validation/).

Now, in the parent component we need to pass the data to our child component using a `v-bind` tag attribute. This attribute value must be the same name to the one defined on the child component's props:

<script src="https://gist.github.com/andreybleme/256b73cfafd5de294fa5188c142dcf8e.js"></script>

By doing so, whenever the "myName" data attribute changes on the parent component, it will flow down to the child component.

Even if using props may seem to be a quite easy way to share data requiring just a few lines of code, it isn't a satisfactory option if we want to share data across sibling components (that is, components at the same hierarchical level).

Creating a global event bus
-------------
The event bus pattern might be an interesting way of getting unrelated sections of your application to talk to each other. By using it, we can properly share data across components, despite of its hierarchical levels.

First thing we'll do to implement it, is to create the event bus in our root module file (in a project generated using the [vue-CLI](https://github.com/vuejs/vue-cli), this file can be the app.js):

<script src="https://gist.github.com/andreybleme/9c4dbe4c34a473b4fd28d8a176e51afb.js"></script>
All we need to do here is to import the Vue library and export a Vue instance (we named it eventBus).

#### Sending events
Now we have to use the Server Bus in the component we want to send data from. Here we'll use as an example two components: *Server* and *ServerDetail*. What we want is to pass information about a server to a component called *ServerDetail*. The *ServerDetail* component will render the server information according to the server clicked by the user on the *Server* component.

First we need to import the Server Bus, and then we can emit events with the data we want to share with another component:

<script src="https://gist.github.com/andreybleme/f2d08a71c0b568d78ddc0ffbb11e3ab2.js"></script>

> The **props** is being used here on line 15 just because this components also receives a server property from another component. Pros is not required for using the Server Bus and they are not related. Props can be replaced by a common data property returning a "server" object with the "id" attribute.

#### Receiving events
Now, any other component of your app can listen to the "serverSelected" event, and use the data passed to its event by using `serverBus.$on`. See the *ServerDetails* component:

<script src="https://gist.github.com/andreybleme/0bba10db733d96adb2dfb0697d0cd1c6.js"></script>

We used the `$on` method inside the `created()` attribute method just because we want to listen to the "serverSelected" since the moment this component is created [(see Vue instance lifecycle) to fully understand the created method](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks). After that, by using an arrow function on line 20, we get the `server` data from the event (passed by the Server component) and then we assign it to `this.server` so we can use it on our ServerDetails component.

-----------

It can quickly become a huge mess to pass data throught events if you're dealing with a big and more complex application with many components. See [VueX](https://vuex.vuejs.org/en/intro.html) to know a better approach to manage you object states across all your Vuejs application.

References and useful links
-------------
- [Passing Data with Props](https://vuejs.org/v2/guide/components.html#Passing-Data-with-Props)
- [Creating a Global Event Bus with Vue.js](https://alligator.io/vuejs/global-event-bus/)
- [Vue Instance Lifecycle Hooks](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks)
- [What is Vuex?](https://vuex.vuejs.org/en/intro.html)
- [Vue JS 2 - The Complete Guide (incl. Vue Router & Vuex)](https://www.udemy.com/vuejs-2-the-complete-guide): strongly recommend this course!

