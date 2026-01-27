# IT Test Runner (TypeScript)

This Lambda function runs the support-workers integration tests on a schedule in AWS.

## Overview

This is a TypeScript port of the Scala IT test runner. It runs the support-workers integration tests using the command:

```bash
pnpm --filter support-workers it-test
```

The tests run every 6 hours and send metrics to CloudWatch. Alarms are configured to alert if:
- Tests fail
- Tests stop running

## How it works

1. The Lambda is triggered on a schedule (every 6 hours)
2. It executes the integration tests using pnpm
3. It parses the test output to extract success/failure counts
4. It sends metrics to CloudWatch:
   - `it-test-succeeded`: Number of tests that passed
   - `it-test-failed`: Number of tests that failed (or 999999 for catastrophic failure)

## Development

### Installation

From the repository root:

```bash
pnpm install
```

### Building

Building and packaging is automated via GitHub Actions (`.github/workflows/it-test-runner-ts-build.yml`).

For local development:

```bash
cd support-lambdas/it-test-runner-ts
pnpm build    # TypeScript compilation
pnpm bundle   # esbuild bundling
```

### Local Testing

To test locally, you can run the integration tests directly:

```bash
cd ../../support-workers
pnpm it-test
```

## Deployment

The lambda is built and deployed automatically via GitHub Actions when code is pushed to the `main` branch or when a pull request is created.

The workflow:
1. Builds the TypeScript code
2. Bundles with esbuild
3. Packages the Lambda with the entire support-workers project structure
4. Uploads to Riff-Raff for deployment

### Manual Deployment (if needed)

If you need to deploy manually, you can follow the steps in the GitHub Actions workflow or see DEPLOYMENT.md for detailed instructions.

## Infrastructure

- **Function Name**: `support-it-tests-ts-{Stage}`
- **Runtime**: Node.js 20.x
- **Memory**: 3008 MB (to accommodate running tests)
- **Timeout**: 900 seconds (15 minutes)
- **Schedule**: Every 6 hours

## Permissions

The Lambda has permissions to:
- Write CloudWatch Logs
- Put CloudWatch Metrics
- Access S3 configuration files
- Scan DynamoDB promo tables
- Send SQS messages to the email queue
- Put events to the acquisitions event bus

## Alarms

### IT Test Failure Alarm
Triggers when tests fail. Evaluates every 15 minutes over a 6-hour window.

### IT Test Not Running Alarm
Triggers when no test metrics are recorded for 7 hours, indicating the tests aren't running at all.
