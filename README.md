Support Workers
===============

This project provides the backend checkout workflows for support.theguardian.com.

It uses [AWS Step Functions](https://aws.amazon.com/step-functions/) to coordinate the various interactions with 3rd party systems
such as Salesforce, Zuora, Paypal and Stripe and to provide retry functionality in the event of service outages.

## Project structure
The project is divided up into a common module, which contains code used by all of the step functions, and separate
modules for each of the step functions.

## Setup

Install awscli
```
brew install awscli
```

Retrieve membership developer AWS credentials from [Janus](https://github.com/guardian/janus) (you will need access to the Janus repo).

## Config
Config for the app is split into public values in [application.conf](common/src/main/resources/application.conf)
and private values which are loaded from S3 when the lambdas start up.

When running locally you can avoid loading config from S3 on each run and load it from a local file instead as follows:

* Retrieve credentials from S3 with the command:

    `sudo aws s3 cp s3://support-workers-private/DEV/support.private.conf /etc/gu/support.private.conf --profile membership`

* Set an environment variable to false by adding the following to your bashrc:

    `export GU_SUPPORT_WORKERS_LOAD_S3_CONFIG=false`

## Test Users
To facilitate testing in production, this project supports the concept of test users.

To work with a test user in the monthly contributions step function pass in a state
object with the user.isTestUser flag set to true. The application will then load configuration
from the UAT configuration block rather than the default for the stage (either DEV or PROD).

## Error handling
[See separate doc](./docs/error-handling.md)

## Tests
There are a number of integration tests in the project which talk to real services, these are useful for real end to end testing, but slow to run and prone to failures if any of the services are playing up.

These tests are tagged with either an @IntegrationTest annotation at the spec level or an IntegrationTest tag at the individual test level which allows us to run them selectively as follows:

`sbt test` - runs all tests including integration tests.

`sbt testOnly -- -l com.gu.test.tags.annotations.IntegrationTest` - runs non-integration tests only.


## Json
This project uses [Circe](https://github.com/circe/circe) to serialise and deserialise json.
Circe has some rather specific behaviour when it comes to handling class hierarchies which it is important to be aware of:

If we have an object of type PayPalReferenceTransaction typed as a PaymentMethod (its superclass) the json produced will be:

     {
        "PayPalReferenceTransaction" : {
          "baId" : "123",
          "email" : "test@test.com"
        }
      }

Whereas the same object typed as a PayPalReferenceTransaction will serialise to:

    {
        "baId" : "123",
        "email" : "test@test.com"
    }

As a result of this we need to decode back to the exact type which we encoded from or we will a get a decoding failure.

This behaviour is illustrated through a number of tests in [CirceEncodingBehaviourSpec.](/monthly-contributions/src/test/scala/com/gu/support/workers/CirceEncodingBehaviourSpec.scala)

## Encryption
To protect user data as it is passed through the various stages of the step functions we encrypt it using the [AWS KMS API](https://docs.aws.amazon.com/kms/latest/developerguide/programming-top.html).

This encryption can be switched off for debugging purposes by setting the aws.useEncryption config setting to false.
