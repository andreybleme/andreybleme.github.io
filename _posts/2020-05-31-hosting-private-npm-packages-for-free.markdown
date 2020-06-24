---
layout: post
title:  "Hosting private NPM packages for free"
description: "A simple and practical way to publish and host private NPM packages for free."
date:   2020-05-31 18:00:00
tags: [javascript]
comments: true
share: true
---

If you want to host a private NPM package but do not want to pay US$ 7 per user, per month to host it directly at [https://www.npmjs.com/](https://www.npmjs.com/) this post is for you. Here I will share a very practical way you can host it privately for free at Github Packages Registry + NPM.

**Important:** The instructions presented here are valid as long as Github provides a free plan for private repositories.

## Publishing the package

### Get your Github Token

The first thing you need to do is to generate a Github token with the following scopes allowed:

> *read:packages*, *write:packages*, and *delete:packages*

Here you can find details on how to create the Github Token: [https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages#about-tokens](https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages#about-tokens).

### Authenticate your local NPM into Github Packages Registry

Now you need to configure your `npmrc` file to use the Github Package registry for your private repositories.

This is how your `npmrc` local file must look like:

```
registry=https://registry.npmjs.org/
@energicos:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=your_token
```

The first line is the default NPM package registry, from where you will still be downloading public packages.

The second line tells NPM to get packages from the organization `@energicos` from the Github Registry instead of the default NPM Registry. This way when we create a package with a name such as `@energicos/entities`, NPM will download it from `https://npm.pkg.github.com/` which is the Github Packages Registry URL.

The third line is for authentication purposes. Here you should change the *your_token* with the Github Token you have generated with the proper scopes.

### Update the package.json file

Now you must include at the package.json file of you NPM package, the Github Package URL:

```
"publishConfig": {
    "registry":"https://npm.pkg.github.com/"
}
```

Finally, having it all done, now you can just publish the NPM package privately and for free by running:

```
npm publish
```

Any client properly authenticated into the Github Packages Registry can install the package by running:

```
npm install @energicos/baseapp
```

### Checking the published package

Through the Github UI, we can see all the published packages, versions, descriptions, and we can also download its content.

To list all the published packages:

![Listing NPM packages](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/list_github_packages.png "Listing NPM packages")

![Details NPM packages](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/details_github_package.png "Details NPM packages")


---

That's it! Now you can have private and free NPM packages easily published.

If you liked this article, consider sharing it!
