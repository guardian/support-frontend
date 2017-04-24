Support Workers
===============

Step functions to provide the backend for support.theguardian.com

Interfaces with:

* Identity
* Salesforce
* Zuora
* Paypal
* Stripe

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


