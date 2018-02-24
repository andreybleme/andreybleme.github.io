---
layout: post
title:  "OAuth Github web flow doesn't support CORS"
description: "When exchanging a code for an access token, there are an additional set of errors that can occur. Here is a workaround for a common one."
date:   2018-02-24 15:00:00
tags: [api, javascript]
comments: true
share: true

---

If you are here, you are probably having CORS issues while implementing the [Github OAuth web flow](https://developer.github.com/apps/building-oauth-apps/authorization-options-for-oauth-apps/#web-application-flow).

I've lost most of my day trying to understand what exactly I was doing wrong. Hope this litle post helps.

These are the steps for successfully authenticating an user to your Github app:

**1.**  Users are redirected to request their GitHub identity

**2.** Users are redirected back to your site by GitHub

**3.** Use the access token to access the API

On **step 2** Github redirects the user back to your site by sending the `code` as a parameter. Then you need to send the `code` parameter content on the `POST https://github.com/login/oauth/access_token` request, so you can exchange this `code` for an fresh new `access_token`. And that's exactly where things get shaky.

If you have a pure-javascript in-browser app, or somehow are performing this request from a browser, the response will be an `OPTIONS method error`.

Why does it happen?
-------------
Hard-coding your *client_id* and *client_secret* into a webpage or some .js file loaded into your app for everyone to see is not recomended. This can cause security concerns, since the *client_secret*  should be kept secret. If someone got hold of your *client_id* and *client_secret*, they could easily impersonate you application, for example, wiping all the tokens for that application using a [Revoke Authorization request](https://developer.github.com/v3/oauth_authorizations/#revoke-all-authorizations-for-an-application).

There is a github issue that explains this security concern, see:
https://github.com/isaacs/github/issues/330

Workaround (maybe definitive solution?)
-------
I have solved this problem by creating a 30 line Nodejs file, to perform the `POST https://github.com/login/oauth/access_token` request and bring me the user `access_token`. See:

<script src="https://gist.github.com/andreybleme/b765c360ce3d0116f8055db392478674.js"></script>

I still don't know if I call it a workaround or definitive solution (doesn't  matter). It works fine because obviously, this code is running in a lightweight Nodejs server, not in the client-side anymore.


References and useful links
-------------
- [Cross origin resource sharing](https://developer.github.com/v3/#cross-origin-resource-sharing)
- [Authorization options for OAuth Apps](https://developer.github.com/apps/building-oauth-apps/authorization-options-for-oauth-apps/)
- [Troubleshooting OAuth App access token request errors](https://developer.github.com/apps/managing-oauth-apps/troubleshooting-oauth-app-access-token-request-errors/)

