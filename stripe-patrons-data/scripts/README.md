# Stripe scripts

Standalone one-off Node.js scripts for querying Stripe data. This is a plain
npm package, deliberately kept outside the pnpm workspace since it's not part
of the deployed application.

## Setup

```sh
cd stripe-patrons-data/scripts
npm install
```

## list-subscribers.js

Exports a CSV of Stripe subscriptions, including the customer's email/name
and the price ID(s) (rate plan) on each subscription.

By default the Stripe API key is read from Parameter Store, at the same path
used by the stripe-patrons-data lambdas
(`/<stage>/support/stripe-patrons-data/stripe-config/api-key`), using AWS
credentials from the `membership` profile — make sure you've run
[`janus`](https://github.com/guardian/janus) first.

```sh
node list-subscribers.js [output.csv]
```

- `STAGE` (optional, default `PROD`): `PROD` or `CODE`.
- `AWS_PROFILE` (optional, default `membership`): AWS profile to use.
- `STRIPE_API_KEY` (optional): supply a key directly, bypassing Parameter
  Store entirely.
- `STRIPE_SUBSCRIPTION_STATUS` (optional, default `active`): subscription
  status to filter on, e.g. `all`, `trialing`, `past_due`. See the
  [Stripe docs](https://stripe.com/docs/api/subscriptions/list).
- Output path defaults to `subscribers.csv` in the current directory.
