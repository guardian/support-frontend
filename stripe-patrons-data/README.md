This stack consists of 3 Lambdas.

The lambdas are [versioned](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html) so that they can use [Snapstart](https://aws.amazon.com/about-aws/whats-new/2022/11/aws-lambda-snapstart-java-functions/) for faster start-ups.

This means that the lambdas are initialised during the riffraff deploy, resulting in faster invocations.

Config is fetched from SSM during initialisation, not during invocation. This means that if you want to change the lambda config you need to also deploy a different build number - otherwise a new lambda version will not be created and the new config will not be picked up. If you don't have a new build then you can [manually run a build from the github UI](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow).

### stripe-patrons-data

A scheduled lambda function which will query Stripe for data on active Guardian Patrons and insert them into the SupporterProductData DynamoDB table
so that we can recognise them on the website and in apps

[More details in this doc](https://docs.google.com/document/d/1uOfEzWhuxi41AafGBMgpu1qyuaCuDGQgM4ME8RU-SuM/edit#heading=h.cgpgefrcf8au)

### stripe-patrons-data-sign-up

Similar to `stripe-patrons-data`, this lambda adds new Patrons to the SupporterProductData table. But it is triggered by a Stripe webhook.

### stripe-patrons-data-cancelled

This lambda is triggered by a Stripe webhook when Patrons cancel their subscription. It updates the row in the SupporterProductData table, setting the cancellation date attribute.
