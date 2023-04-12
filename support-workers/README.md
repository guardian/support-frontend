Support Workers
===============

This project provides the backend checkout workflows for support.theguardian.com.

It uses [AWS Step Functions](https://aws.amazon.com/step-functions/) to coordinate the various interactions with 3rd party systems
such as Salesforce, Zuora, Paypal and Stripe and to provide retry functionality in the event of service outages.

## Project structure
The project is divided up into a common module, which contains code used by all of the step functions, and separate
modules for each of the step functions. It also depends on the [support-models](https://github.com/guardian/support-models) library which defines all the state to be shared between this project and [support-frontend](https://github.com/guardian/support-frontend)

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

    `sudo aws s3 cp s3://support-workers-private/CODE/support-workers.private.conf /etc/gu/support-workers.private.conf --profile membership`

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

`sbt test` - runs unit tests only and excludes integration tests.

`sbt it:test` - runs all tests including integration tests.

## Deployment
We use [Riff-Raff](https://github.com/guardian/riff-raff) to deploy this project to production each time a new change is merged to the default branch.

The following steps happen as part of a deployment:

1. (If necessary) Cloudformation updates are applied in AWS. For example, if your change removes a task from the Step Function, or deletes one of the Lambdas, Riff-Raff triggers a change to the underlying AWS resources.
2. The .jar used by each of the Lambdas defined in this project is updated, meaning that all future Lambda invocations will run code which contains the new changes.

It's important to be aware that some Step Function executions may still be in progress when new changes are deployed. This means that all changes merged to the default branch should be backwards compatible for old executions (i.e. executions which depend on the resources from the old Cloudformation template, and the old versions of the Lambda functions).

Examples of changes which could break existing executions include editing the JSON structure which is passed between two of the Lambdas, or deleting a Lambda from the Cloudformation template. In such cases, it's often necessary to split changes into two PRs. The initial PR is used to transition all future executions to use only the new code or resources, and a second PR is used to tidy up, after ensuring that all running executions are now using the new JSON structure or Step Function definition.

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

This behaviour is illustrated through a number of tests in [CirceEncodingBehaviourSpec.](/src/test/scala/com/gu/support/workers/CirceEncodingBehaviourSpec.scala)

## Emails
Docs on how emails are sent from this app are [here](/docs/triggered-send-in-exact-target.md).

## Data subject access requests
The state machine executions of this app have been identified as a data store which we would need to include in a response to any subject
access requests we may receive ([this is a good explanation of what these are](https://ico.org.uk/media/for-organisations/documents/2014223/subject-access-code-of-practice.pdf)).
Should it be necessary to search them, this can be done using the `StepFunctionsService` class, see `StepFunctionsSpec` for how to do this.
