# Acquisition Events Api
- API for sending in-app acquisitions(subscriptions) to BigQuery using a lambda

[Architecture diagram](https://docs.google.com/drawings/d/10H4fWh2byXRIuV82IyEJkQzMnHX6eCto3GLYtHiBrNE/edit)
## Testing
To test locally:
- Comment out `@Ignore` from `LambdaSpec.scala`
- Run: `AWS_PROFILE=membership sbt`
- In sbt, run: `project acquisition-events-api`; `test`

An example json in `ExampleRequestBody.json` to test on AWS API Gateway

## Manually Inserting Failed Events

At the moment (as of 2023-07-28), the acquisition-events-api doesn’t have a dead
letter queue or anything similar, so events can fail to be written to BigQuery.
In these cases, the API can be manually hit with curl to re-send the events.

First, get the event from the [acquisition-events-api logs in
cloudwatch](https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Facquisition-events-api-cdk-PROD).
[This
search](https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Facquisition-events-api-cdk-PROD/log-events$3FfilterPattern$3DFailed+event+was$26start$3D-1800000)
will find the relevant error messages from the last 30 minutes: customise the
time window to find the events you’re looking for. Save the event in a json file
(use individual files per event if you have multiple).

Get the URL for the acquisition-events-api lambda [from the AWS
console](https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/applications/acquisition-events-api-PROD).
The URL you want is the API Endpoint URL, which should end in `/prod`.

Call curl with the endpoint and provide the json file as data:

``` sh
curl -i -X POST "$apiEndpoint" -d @/path/to/acquisition.json
```

(I've included `-i` so you can see the response headers – without them it’s
often not clear whether the request succeeded. As long as you get a 200 it
should be fine.)
