---
layout: post
title:  "Refactoring a RPG Game"
description: "Refactoring the RPG Game project that I have implemented a time ago for a job interview and documenting some lessons learned."
date:   2019-02-05 20:00:00
tags: [java]
comments: true
share: true
---

I often hear people saying that if you don't look back at some code you wrote in the past and feel ashamed, you are not evolving enough as a developer. Actually, I don't think that fell ashamed will make you a better professional, instead, try to do a better job, compare the results and prove to yourself that you are capable of doing a better job.

In this post I'll show how I fixed some issues a tech recruiter pointed out in a command line RPG Game I submitted for a job position some time ago. I will not show details of the hole implementation, even that it is quite simple, the focus is to fix specific parts that was poorly written.

Since it was a good experience, I will let some tips at the end of the post for a future me (or you), to keep in mind when writing code for a developer job process. 

The RPG Game
----

They want me to build a command line based role playing game.

Here are the stories:

- As a player I want to create a character.
- As a player I want to explore.
- As a player I want to gain experience through fighting.
- As a player I want to save and resume a game.

It was clear since the beginning that the implementation should be as simple as possible, no need to be super creative or to use modern libraries/frameworks. 

I used Java 8 with Spring Boot to speedup the setup. The game records are stored in a MySQL database. I have implemented all the stories, properly working and with a good test coverage for business logic (class 100%, method 81%, line 54%).

You can find the complete code on [this bitbucket repository](https://bitbucket.org/andreybleme/rpg-game). 

TODO
----
#### Automate creation of database and tables

In order to keep the project with less dependencies as possible, in the `readme.md` file there is a simple script that needs to be ran in order to setup the database for the first time:

<script src="https://gist.github.com/andreybleme/e5f93d14e9d67ad2f60fa2c2c6d0c7f1.js"></script>

The feedback I got: **"Creation of database, tables and etc. can be done by Flyway, Liquibase or similar tools automatically."**

So let's use [Flyway](https://flywaydb.org/) to automatically setup our database when the application starts. Flyway is a version control tool for your database, very useful when dealing with different database models for the same application.

First, we need to add the Flyway dependency in our `pom.xml` file:


<script src="https://gist.github.com/andreybleme/acb3c63b1c659a1e021717dcdd09b5b8.js"></script>

Now we can use Flyway API in our `RpgGameApplication.java` startup class in order to create a brand new schema when the application starts. If a schema with the given name already exists, Flyway will not attempt to create a new one.

<script src="https://gist.github.com/andreybleme/a29d477eeb975f1b5e66aaf2d304fc98.js"></script>

That's all we need from Flyway to make the database setup 100% automatic. If you want to learn another Flyway features, such as migrations, I recommend you to [read the docs](https://flywaydb.org/getstarted/).

#### Remove circular dependencies

As we have seen, there is a requirement for a player to be able to explore with its character. This exploration process was designed to be pretty simple: when a player choose to explore, the game shows a random message containing some fun event description like "You defeated a gang of thieves in the Gotham City Bank!" then, the character has its experience (XP) increased. 

To do so, the first strategy that came up to my mind was basically: each time a player choose to explore, an `ExplorationFactory` class will create some objects representing possible explorations for a character and persist them as "available explorations" in the database:

<script src="https://gist.github.com/andreybleme/6e049b268c9b3c84e6bcd699b1291b4a.js"></script>

Finally, the `ExplorationServiceImpl` class picks randomly one of the Exploration records, based on its ID:
  
<script src="https://gist.github.com/andreybleme/68a0c6cd22292a1296f13c33664cc4ff.js"></script>

Here I have accidentally created a **circular dependency between the Factory and the Service class**. Usually this kind of issue indicates a poor design solution: you either don't know how to properly create a hierarchical structure or simple cannot well define the responsibility of the application components.

Before fixing it, let's just check a feedback that came together with this circular dependency one.

#### Stop using DB to create explorations each time

"Each time the user chooses to EXPLORE, we read a list of Explorations from the database. We didn’t quite get your design reasons go to the DB each time. Or, when looked from another side, why should we store those in a DB if you recreate objects each time?".

That's the time I realized I screwed it. A classical super engineering issue... To be honest, at the time I did this interview I was reading Eric Evans' Domain Driven Design book and some of those service/factory/specification concepts were being reorganized inside my mind. I choose this test to apply a Factory but actually it was not well thought.

Here we can fix both this abuse DB calls issue and the circular dependency problem by just removing the persisting explorations responsibility from the Factory:

<script src="https://gist.github.com/andreybleme/e02dd2e6a1150bd1247e7f41ae78ae80.js"></script>

Now we are storing the explorations in a temporary list, defined as an attribute of the Factory instead of using the database. The `ExplorationServiceImpl` only needs to ask the Factory to generate the explorations and chooses randomly one of the explorations available on the list:

<script src="https://gist.github.com/andreybleme/eee335f5f7e128d7566a5eb70105ec89.js"></script>

####  Decrease client responsibility 

`RpgGameClient` is the class responsible for presenting the game menu with its options. It has too many responsibilities for my taste, and the current design doesn’t provide an easy way to extend the game menu and possible player actions. See:

<script src="https://gist.github.com/andreybleme/cc0fb5cb6dcd81acf836e4cae873efb9.js"></script>

The `runGame()` method controls game actions such as: start new game, load existing game and quit. The `startGame()` is called when a player chooses to start a game, so this is the part of the code where we execute players' actions (explore, fight, save and quit). 

The structure of both these methods are very similar:
 
**1.** show player's options through text messages.

**2.** read player's input.

**3.** execute the corresponding action using services. 

So here we have some alternatives to make this client class simpler. We could extract local methods, so the entire logic of each player's action would be encapsulated in a local method inside this `RpgGameClient` class. We could also create an Util class such as `MenuUtils`, to be responsible for rendering the messages and let the client class with the single responsibility of calling the corresponding services according to player's input. The point is: I want these menu options to be more extensible. I want this menu structure to support different possibilities for changing messages, adding new menu options and performing more than one action per user input for example. To do so we will create [command objects](https://refactoring.guru/design-patterns/command/java/example).

Command is a behavioral design pattern that turns a request into a stand-alone object that contains all information about the request. This transformation lets us parameterize methods with different requests, and options that changes its behavior. The Command pattern suggests that GUI objects (such as our player's actions) shouldn’t send requests directly. Instead, we should extract all of the request details, such as the object being called, the name of the method and the list of arguments into a separate command class with a single method that triggers this request. It will give us the extensibility we want for the game menu, so let's see the implementation for the RPG Game.

First thing to implement the Command pattern is to have a Command abstract class to represent the basic structure of all the following commands (new game and load game):

<script src="https://gist.github.com/andreybleme/6f4995cc1b0c590f3c1431ddaa1e2ef7.js"></script>

Now we can encapsulate the logic of any action in a Command implementation, as you can see in `NewGameCommand`:

<script src="https://gist.github.com/andreybleme/a63ad1c9a155e4d5a1b9d17f204af842.js"></script>

Having this structure for each of the player's commands we have a way cleaner and flexible client class:

<script src="https://gist.github.com/andreybleme/95441ec039fbf9591f57b71054f3eabe.js"></script>

Another simple improvement here: we extracted all these "\u001B[31m" strings used to change message colors into a new class named `MenuConstants` where we have a constant for each color we need to print, such as `ANSI_BLUE`.

Final thoughts on submitting code for job interviews
----
When a company gives you a reasonable time to deliver a small code project, they want to see what you know, so show off. Do you know some design pattern that might fit in? Use it. And if you finished implementing the code, but there is still something proper to be refactored go ahead and do it.  The same way he gives you a negative feedback about a class with too much responsibilities, an interviewer might be happy to see that you cared about some specific piece of your solution.

It's helpful to write down in a white paper some draft of the solution you are going to build before starting to code. It's surprisingly easy to get distracted during the implementation and create things that does not matter for a given scope. Focus on delivering the solution you have drafted and improve it latter, if possible.

 **Always keep in mind the deadline and the scope, so you will be able to improve things at the end.**

Are you new to some technology/technique/tool and want to try it? Do it elsewhere. It's not a good idea to try it on your code interview test! Chances of make a mess using some tool you have just learned in a high pressure situation like this are nearly 90%. Don't put yourself at risk unnecessarily. Even if you think "oh, this is such a modern lib/framework, they'll be impressed when they see I have used it", DO NOT do it. You will find a better way to impress. If you don't, then you are not ready for the job anyway.



References and useful links
-------------

- [Flyway automatic schema creation](https://dzone.com/articles/flyway-21-released-automatic)
- [Refactoring Guru - The Command Pattern](https://refactoring.guru/design-patterns/command)
- [Refactoring Guru - Refactoring Techniques](https://refactoring.guru/refactoring/techniques)

