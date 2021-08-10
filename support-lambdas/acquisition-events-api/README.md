# Acquisition Events Api
- API for sending in-app acquisitions(subscriptions) to BigQuery using a lambda

## Testing
To test locally:
- Uncomment <code>@Ignore</code> from <code>LambdaSpec.scala</code>
- Type in <code>AWS_PROFILE=membership sbt</code> in <code>sbt</code>

An example json in <code>ExampleRequestBody.json</code> to test on AWS API Gateway

