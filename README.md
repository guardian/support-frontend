# Payment Service

The payment service provides an API for creating PayPal and Stripe payments.

## URL Healthcheack

* Production: https://payment.guardianapis.com/healthcheck
* CODE: https://payment.code.dev-guardianapis.com/healthcheck

## Running Locally

Get AWS credentials from Janus

Run `sbt run` and the project will start up locally under:

`http://localhost:9000/healthcheck`

### Connecting to the test database

In order to connect to the test database, before running the app:

- configure `Membership` credentials using Janus
- update (or create) the file `/etc/hosts` with the line:
  ```
  127.0.0.1   contributions-store-code.c0gunnrs6vkk.eu-west-1.rds.amazonaws.com
  ```
- `gem install prism-marauder`
- set up your `~/.config/marauder/defaults.yaml` file with contents `prism-url: http://<prism-host>` (ask to find the right host)
- clone the repo [contributions-platform](https://github.com/guardian/contributions-platform) and from the root 
  directory of the project run:
  ```
  ./contributions-store/contributions-store-bastion/scripts/open_ssh_tunnel.sh -s CODE
  ```

## Running tests

Run `sbt run`. No integration test provided so far.

### Testing manually

You can import API calls into POSTMAN from [here](postman) or get request/response examples form the unit test controllers.
