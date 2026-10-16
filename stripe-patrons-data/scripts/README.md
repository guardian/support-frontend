# Stripe scripts

Standalone one-off Node.js scripts for querying Stripe data. This is a plain
npm package, deliberately kept outside the pnpm workspace since it's not part
of the deployed application.

## Setup

This folder is deliberately outside the pnpm workspace (see `pnpm-workspace.yaml`
at the repo root), so a plain `pnpm install` run from here would otherwise be
swallowed by the root workspace and do nothing. Use `--ignore-workspace` to
install locally instead:

```sh
cd stripe-patrons-data/scripts
pnpm install --ignore-workspace
```

## list-subscribers.js

Exports an aggregate, anonymised CSV of Stripe subscriptions in "active" or
"unpaid" status: one row per subscription with price ID, currency, and
whether payments are up to date. No customer or subscription identifiers,
or any other PII, are included.

Requires a Stripe API key, passed via `STRIPE_API_KEY`. Fetch the restricted
key named **"Customer / Product Read Only"** directly from the Stripe
dashboard (Developers > API keys) — do not use a full secret key.

```sh
STRIPE_API_KEY=rk_live_xxx node list-subscribers.js [output.csv]
```

- Output path defaults to `subscribers.csv` in the current directory.
