# Copilot Instructions

## Project Layout

This repository contains multiple projects, implemented in Scala and TypeScript.

TypeScript projects are organized as pnpm workspaces.

Scala projects are managed with SBT, specifically as a single multi-project SBT
build.

These are the major sub-projects:

### Support Frontend

Under `./support-frontend`. This is the user facing site containing landing
pages and checkouts for Guardian products, both those with recurring billing and
single contributions. Comprises a Scala Play backend and a TypeScript/Preact
client. Scala code is under `./app` and TypeScript code is under `./assets`.

### Payment API

Under `./payment-api`. This is an API to handle single contributions via
different payment methods. It is implemented as a Scala Play app.

### Support Workers

Under `./support-workers`. This project is implemented as an AWS step function
which orchestrates a number of TypeScript lambdas to handle various parts of
processing a purchase or a recurring billing product. For example interacting
with Zuora (our billing platform), interacting with Salesforce, and sending
thank you emails. Executions of the step function are invoked by the
support-frontend Scala Play backend.

### Support Backend

Under `./support-backend`. This is a TypeScript Express project, which we are
migrating backend endpoints from the support-frontend Scala Play app to. This
project is a work in progress.

### CDK

Under `./cdk`. This subproject defines infrastructure for all of the other
subprojects, defined as AWS CDK using the @guardian/cdk NPM package.

## Project conventions

We use standard Guardian eslint and prettier configurations for TypeScript code
and sbtfmt for Scala code. We mostly use Jest for testing TypeScript code, with
some usage of vitest. We use ScalaTest for testing Scala code.

## Verification

Run tests for TypeScript code with `pnpm --filter <workspace> test`.
