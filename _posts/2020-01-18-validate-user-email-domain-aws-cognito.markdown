---
layout: post
title:  "Validating user email domains with AWS Cognito"
description: "Here we will see how can we control users' sign-in using only allowed email domains, by using Cognito and Lambda Functions."
date:   2020-01-18 14:00:00
tags: [security, aws, devops]
comments: true
share: true
---


When using Cognito to manage authentication in your app, you can surely expect to get many things out of the box: SSO, an UI to users sign-in and sign-up, OpenID Connect, OAuth 2.0, SAML 2.0 and so on. Among so many configuration options, one very common need seems not to be possible: **validate your user e-mail domain** when signing-in or signing-up.

If you simply want to make sure your users to authenticate using a specific email domain, such as "@yourcompany.com", you can't rely on any cognito ready to use feature, you have to implement this validation by yourself.

Let's have a look at how we can easily validate user's email domains using a Lambda Function and some Cognito User pool Triggers.

### Overall solution

The first thing we'll do is create a Lambda Function that will be triggered whenever a user sign-in or sign-up into our app. This Lambda function will contain the validation code and will return a success callback if the user uses a valid email domain, or will return an error callback when the input user e-mail is from an undesired domain.

To trigger this Lambda Function whenever users sign-up, we'll create a trigger to our Cognito User Pool that will call the Lambda Function. Cognito supports triggers for [many types of events](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html?icmpid=docs_cognito_console), the event that we'll configure to trigger our action is the "Pre sign-up". It means that every time our Cognito User Pool receives the sign-up event, we'll call our Lambda Function code.


### Creating the Lambda Function

The code that will perform our validation looks pretty simple:

<script src="https://gist.github.com/andreybleme/87abdc22167d3ad29ca67fccffc83e82.js"></script>

The most important thing here is the **line 3** where we capture the email address of the user that is trying to sign-in/sign-up. The content of this `event` object will look like this after we configure the trigger on the Cognito User Pool:


<script src="https://gist.github.com/andreybleme/6aa969763f83349f236587fc28162aac.js"></script>

So basically what we need is a simple string comparison (**line 6**). Here we'll return a success callback if the email domain is equal to "someone@andreybleme.com": `callback(null, event)`. Otherwise, at **line 10** we'll return an error callback: `callback(error, event)`.


### Configuring the Cognito triggers

Assuming we have already created the Lambda Function and it contains of validation code, now we need to tell cognito to execute this Function every time it receives and sign-in or sign-up event. To do so, go to the AWS console at your Cognito User Pool, and select the option "Triggers" at the "General Settings" tab menu. Then at the events "Pre sign-up" and "Pre-authentication" select the name of the Lambda Function we have previously created:

![AWS Cognito User Pool Triggers](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/aws-cognito-userpool-trigger.png "AWS Cognito User Pool Triggers")

As you can see, I named my Function "Dev_ValidateUserEmail" and they are correctly selected at both trigger event options.

---

And that's all. I think that Cognito should provide some built-in configuration for this kind of validation which so common. Until it does not provide that for us, we need to make these kinds of workarounds...

And of course, you can take advantage of these cognito event triggers and perform all kinds of things for any user authentication action.


References and useful links
---

-  [Customizing User Pool Workflows with Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html)

-  [Pre Sign-up Lambda Trigger](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html)
