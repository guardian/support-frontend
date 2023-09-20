# Payment Service

The payment service provides an API for creating PayPal and Stripe payments.

## URL Healthcheck

* Production: https://payment.guardianapis.com/healthcheck
* CODE: https://payment.code.dev-guardianapis.com/healthcheck

## Running Locally

Get AWS credentials from Janus.

From the root of the `support-frontend` repository, run `sbt "project support-payment-api" run` and the project will start up locally under:

`http://localhost:9000/healthcheck`

## Running tests

No integration test provided so far.

### Testing manually

You can import API calls into POSTMAN from [here](postman) or get request/response examples form the unit test controllers.

### SSH

You must ssh via the bastion, e.g. using [ssm-scala](https://github.com/guardian/ssm-scala):

`ssm ssh --profile membership --bastion-tags contributions-store-bastion,support,PROD --tags payment-api,support,CODE -a -x --newest`
