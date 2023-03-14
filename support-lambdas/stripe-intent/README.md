# Stripe Intent lambda plus API gateway

This lambda creates Stripe [SetupIntents](https://stripe.com/docs/api/setup_intents) for creating recurring payments.

It is invoked by the `support-frontend` backend.

It loads the support-workers config for Stripe, and gets a setup intent id for the relevant
stripe account.

It is a lambda because it doesn't need a whole auto scaling group,
the latency is not critical, and doing it this way provides better
separation between codebases.

It is a separate jar from the support-workers jar because the unused
code would add to be loaded on every single step of the functions.
Hopefully we can be a bit more cohesive and minimise dependencies if
we separate things better.
