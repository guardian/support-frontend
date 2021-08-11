# Acquisition Events Api
- API for sending in-app acquisitions(subscriptions) to BigQuery using a lambda

[Architecture diagram](https://docs.google.com/drawings/d/10H4fWh2byXRIuV82IyEJkQzMnHX6eCto3GLYtHiBrNE/edit)
## Testing
To test locally:
- Comment out `@Ignore` from `LambdaSpec.scala`
- Run: `AWS_PROFILE=membership sbt`
- In sbt, run: `project acquisition-events-api`; `test`

An example json in `ExampleRequestBody.json` to test on AWS API Gateway

