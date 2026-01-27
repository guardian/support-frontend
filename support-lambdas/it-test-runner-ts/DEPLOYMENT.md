# IT Test Runner TypeScript - Deployment Guide

## Overview

This is a TypeScript implementation of the IT test runner lambda that runs support-workers integration tests on a schedule in AWS.

## What Was Created

### Files Created
1. **support-lambdas/it-test-runner-ts/src/index.ts** - Main Lambda handler
2. **support-lambdas/it-test-runner-ts/package.json** - NPM package configuration
3. **support-lambdas/it-test-runner-ts/tsconfig.json** - TypeScript configuration
4. **support-lambdas/it-test-runner-ts/esbuild.config.mjs** - Build configuration
5. **support-lambdas/it-test-runner-ts/eslint.config.mjs** - Linting configuration
6. **support-lambdas/it-test-runner-ts/build.sh** - Build and packaging script
7. **support-lambdas/it-test-runner-ts/cfn.yaml** - CloudFormation template
8. **support-lambdas/it-test-runner-ts/riff-raff.yaml** - Riff-Raff deployment configuration
9. **support-lambdas/it-test-runner-ts/README.md** - Documentation
10. **support-lambdas/it-test-runner-ts/.gitignore** - Git ignore rules

### Files Modified
- **pnpm-workspace.yaml** - Added it-test-runner-ts to workspace packages and @types/aws-lambda to catalog

## How It Works

1. Lambda is triggered every 6 hours via CloudWatch Events
2. Executes `pnpm --filter support-workers it-test` in the Lambda environment
3. Parses Jest output to extract test success/failure counts
4. Sends metrics to CloudWatch:
   - `it-test-succeeded`: Number of tests that passed
   - `it-test-failed`: Number of tests that failed (999999 = catastrophic failure)
5. CloudWatch Alarms monitor the metrics

## Key Differences from Scala Version

- Uses pnpm to run Jest tests instead of downloading a JAR file from S3
- Packages the entire support-workers project structure with the lambda
- Written in TypeScript instead of Scala
- Uses Node.js 20.x runtime instead of Java 21

## Installation & Building

### Prerequisites
- Node.js 20.x
- pnpm 10.x

### Automated Build (via GitHub Actions)

The lambda is built automatically via the GitHub Actions workflow located at:
`.github/workflows/it-test-runner-ts-build.yml`

The workflow runs on:
- Pull requests
- Pushes to the `main` branch
- Manual trigger via `workflow_dispatch`

### Build Steps (Automated)

The GitHub Actions workflow:
1. Sets up Node.js and installs dependencies
2. Builds CDK CloudFormation templates
3. Compiles TypeScript code (`pnpm build`)
4. Bundles with esbuild (`pnpm bundle`)
5. Packages the Lambda with the entire support-workers project structure:
   - Copies support-workers source code and tests
   - Copies node_modules
   - Copies pnpm workspace configuration
   - Creates deployment zip file
6. Uploads to Riff-Raff for deployment

### Local Development Build

For local development and testing:

```bash
# From repository root
pnpm install

# Build TypeScript
cd support-lambdas/it-test-runner-ts
pnpm build

# Bundle with esbuild
pnpm bundle
```

Note: The full packaging step (including copying support-workers) is handled by GitHub Actions.

## Deployment

### Automated Deployment (Recommended)

The lambda deploys automatically via GitHub Actions and Riff-Raff:

1. **Create a Pull Request** or **Push to main**
2. GitHub Actions workflow builds the lambda:
   - Compiles TypeScript
   - Bundles with esbuild
   - Packages with support-workers code
   - Creates `it-test-runner-ts.zip`
3. Uploads artifact to Riff-Raff
4. Deploy via Riff-Raff UI to CODE or PROD

### Riff-Raff Configuration

The workflow uploads to:
- **Project**: `support:lambdas:it-test-runner-ts`
- **S3 Location**: `s3://support-workers-dist/support/{STAGE}/it-test-runner-ts/it-test-runner-ts.zip`
- **Build Number Offset**: 16000

### Manual Deployment (if needed)

If automated deployment is unavailable, you can manually build and deploy:

```bash
# 1. Build locally (requires replicating GitHub Actions steps)
cd support-lambdas/it-test-runner-ts
pnpm build
pnpm bundle

# 2. Package (copy these commands from the GitHub Actions workflow)
# See .github/workflows/it-test-runner-ts-build.yml for exact steps

# 3. Upload to S3
aws s3 cp target/it-test-runner-ts.zip s3://support-workers-dist/support/CODE/it-test-runner-ts/

# 4. Update Lambda
aws lambda update-function-code \
  --function-name support-it-tests-ts-CODE \
  --s3-bucket support-workers-dist \
  --s3-key support/CODE/it-test-runner-ts/it-test-runner-ts.zip
```

## Infrastructure

### Lambda Configuration
- **Function Name**: `support-it-tests-ts-{Stage}`
- **Runtime**: Node.js 20.x
- **Memory**: 3008 MB
- **Timeout**: 900 seconds (15 minutes)
- **Schedule**: Every 6 hours
- **Retry**: Disabled (MaximumRetryAttempts: 0)

### Permissions
The Lambda has IAM permissions for:
- CloudWatch Logs (write)
- CloudWatch Metrics (put)
- S3 (read configuration files)
- DynamoDB (scan promo tables)
- SQS (send email queue messages)
- EventBridge (put acquisition events)

### Alarms

#### IT Test Failure Alarm
- **Metric**: `it-test-failed`
- **Threshold**: > 0
- **Evaluation**: 25 periods of 15 minutes (6 hours + buffer)
- **Action**: SNS notification to alarms-handler-topic

#### IT Test Not Running Alarm
- **Metric**: Sum of `it-test-succeeded` + `it-test-failed`
- **Threshold**: < 100 (over 7 hours)
- **Evaluation**: 7 consecutive hours
- **Action**: SNS notification to alarms-handler-topic

## Monitoring

### CloudWatch Logs
Logs are available at: `/aws/lambda/support-it-tests-ts-{STAGE}`

### CloudWatch Metrics
- Namespace: `support-frontend`
- Dimensions: `Stage={STAGE}`
- Metrics:
  - `it-test-succeeded` - Count of passed tests
  - `it-test-failed` - Count of failed tests

### Viewing Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace support-frontend \
  --metric-name it-test-succeeded \
  --dimensions Name=Stage,Value=CODE \
  --start-time $(date -u -v-1d +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Sum
```

## Troubleshooting

### Tests Not Running
1. Check Lambda logs in CloudWatch
2. Verify pnpm and support-workers are packaged correctly
3. Check IAM permissions

### Tests Failing
1. Review test output in Lambda logs
2. Run tests locally: `cd support-workers && pnpm it-test`
3. Check if CODE environment data is broken

### Package Too Large
If the deployment package exceeds Lambda limits:
1. Consider excluding unnecessary node_modules
2. Use Lambda layers for large dependencies
3. Optimize the build.sh script to exclude test fixtures

## Next Steps

- [ ] Test the build process locally
- [ ] Deploy to CODE environment
- [ ] Monitor first test run
- [ ] Verify metrics and alarms work correctly
- [ ] Consider migrating from Scala version once stable
- [ ] Add integration with Riff-Raff build pipeline
