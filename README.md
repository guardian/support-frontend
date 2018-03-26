# Payment Service

The payment service provides an API for creating PayPal and Stripe payments.

### URL Healthcheack

* Production: https://payment.guardianapis.com/healthcheck
* CODE: https://payment.code.dev-guardianapis.com/healthcheck

### Running Locally

Get AWS credentials from Janus

Run `sbt run` and the project will start up locally under:

`http://localhost:9000/healthcheck`

### Running tests

Run `sbt run`. No integration test provided so far.

### Testing manually

You can import API calls into POSTMAN from [here](postman) or get request/response examples form the unit test controllers.
