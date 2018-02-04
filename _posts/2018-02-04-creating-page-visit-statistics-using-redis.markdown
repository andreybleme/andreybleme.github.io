---
layout: post
title:  "Creating page visit statistics using Redis"
description: "Easily creating page visit statistics using strings and bitmaps on Redis."
tags: [java, redis]
date:   2018-02-04 13:00:00
categories: java, redis
comments: true
share: true
---

There are a lot of use cases where redis can be a good choice (caching, queues, messaging, counting, simple storage, etc). In general, for [hot data](http://searchstorage.techtarget.com/definition/hot-data) redis is known to be fast, simple and useful. That's because Redis is an in-memory datasctructure storage, used as a database, that supports storing strings, lists, hashes and so on. You can see more about redis in the [official webpage,](https://redis.io/) and during this post we will see some reasons [why redis has become so popular](https://www.atlantic.net/cloud-hosting/why-redis-has-become-so-popular-fast-open-source/).

Creating a real-time access counter to generate statistics for a website might seem to be a complex task involving different systems or something like this. By using redis, we can do it quickly, without any performance negative impact and using a tiny memory space.

For this example, let's store statistics about daily visited pages This way we'll be able to know how many times a page was visited for each day. Consider a website called "Redis expert" containing the pages:

``` 
/home

/contact

/about-me

/posts

/storing-data-on-redis
```

First thing we need to do is to define a key structure for our records.  Our data will be separeted by day, so we need to use a date in our key and also, the page that received the visit. So, we can have a structure for the key such as: 

`page:[page url]:[date]`.	

On a real scenario:

`page:home:04-02-2018`

Seeing the key structure we can have an idea of what we'll need to do for creating our statistics: we will increment the key value for each access on that page, that's something easy to execute. 

Let's check out some different approaches to do it.

Incrementing key value using INCR
-------------
The `INCR` redis command allows us to increment the value of a given key without knowing its existing value. Redis does not support the data type Integer, so it will interpret our data in this case, as a String.

Now that we know wich command to use and having a key structure already defined, let's see a simple implementation of it's incrementation proccess using the Jedis client:

> You can use any Redis client of your choose. There are [many clients for different languages](https://redis.io/clients). In this post I'm using Jedis (client for Java).

<script src="https://gist.github.com/andreybleme/aacf7b82af54c337040e46ddbd56e2a5.js"></script>

This will produce the following output:

```
page /home had 1 accesses in 02/09/2018

page /contact had 1 accesses in 02/09/2018

page /about-me had 1 accesses in 02/09/2018

page /contact had 2 accesses in 02/09/2018

page /contact had 3 accesses in 02/09/2018
```
At **line 8** where we do `long resultado = jedis.incr(key);` the key value is being incremented. We could get the same result by running in a redis-cli (command line) the INCR instruction such as:

`127.0.0.1:6379> INCR page:/contact:02/09/2018`

 > **Maybe you are wondering:** can't I do it by executing 2 commands (GET ans SET)? Yes you can. But by doing like this, you wouldn't be executing an atomic operation. Your code might have racing condition problems. 

That's the simplest possible way for storing and retrieving page visits data.

What if we want to store our data organizing it by user, and the visit date of a page? The main difference is that now the amount of data stored on Redis will be much bigger than the amount stored in out previous example, where we were counting visits for each existing page.


Using bitmaps
-------------
Because of the huge amount of data that we are going to store now, we will use *Bitmaps*. *Bitmaps* are arrays of bits (arrays containing only 0 and 1), commonly used because when we store data in a binary format, the amount of memory needed is really small, and also, calculation operations involving Bitmaps are extremely fast. 

Redis provides some commands for to manipulate Bitmaps, let's see some of them before implementing our definitive solution using Jedis:


`127.0.0.1:6379> SETBIT access:/home:04/02/2018 123 1
(integer) 0`

The `SETBIT` command is quite similar to `SET` command. They both sets a value for a given key. Here our key is `access:/home:04/02/2018` and we are setting a value 123 for this key, where 123 represents the unique code of the user who visited the home page on 04/02/2018. The final parameter (number 1) is what we call **bit**, it validates that the user  in fact clicked in our /home page, that is: when we define the bit value to 1, it means the user clicked and, if for some reason we define the bit value to 0, we are invalidating the user click.

As we can create bitmaps, of course we can also get its bit value by using the `GETBIT` command:

`127.0.0.1:6379> GETBIT access:/home:04/02/2018
(integer) 1`

### Generating test data
Now that we have seen the main operations involving bitmaps, let's create our implementation for getting statistics. We will create a Java class to generate the data (simulating 1000 access, from 500 different users in a period of 30 days):

<script src="https://gist.github.com/andreybleme/2b6378a5ea04c3bdb6abff203ed49ce3.js"></script>

Now we should have a good amount of data stored on Redis to retrieve some interesting information.


### Getting page access statistics
Let's create the methods for extracting the page access information by day and by week:

<script src="https://gist.github.com/andreybleme/53a476d807dbf684275f0295d5bacd43.js"></script>

The only new command we used here is `BITCOUNT`. It returns the number of bits defined in a key value, that is, the `BITCOUNT` makes a sum of the values with the bit value equal to 1 and returns it.

The output should be something like:

```
Total unique users on [05/11/2018] was: 27

Total unique users on [16/11/2018, 17/11/2018, 18/11/2018, 19/11/2018, 20/11/2018, 21/11/2018, 22/11/2018] was: 246
```

> **Remember:** we have generated the data randomly, so the output content may variate.

---

As we have seen, by getting known of the different data structures supported by Redis, we can easily implement solutions for quickly storing and retrieving many types of data. For counting, we have alternatives that better fits when we are dealing with a hight amount of data (Bitmaps), and data structures with simpler operations such as Strings with commands `INCR` and `INCRBY`. 


References and useful links
-------------
- [Introduction to redis data structure - Bitmaps](https://scalegrid.io/blog/introduction-to-redis-data-structure-bitmaps/)
- [ SETBIT key offset value ](https://redis.io/commands/setbit)
- [Learning Redis - PACKT e-book](https://www.packtpub.com/big-data-and-business-intelligence/learning-redis)

