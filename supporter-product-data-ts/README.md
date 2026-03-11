# supporter-product-data-typescript

Initial TypeScript rewrite scaffold of the Scala `supporter-product-data` service.

## What is included

- Lambda handlers for the 4 existing pipeline stages
- `ConfigService` that reads from the same SSM path as Scala:
  - `/supporter-product-data/{STAGE}/zuora-config/*`
- Unit tests and integration-test group setup (Jest + `jest-runner-groups`)
- CDK app that defines lambdas, SQS, and Step Function scheduling for CODE/PROD
- `riff-raff.yaml` for deployment
- GitHub workflow to build, test, synth, and upload artifacts to RiffRaff

## Local commands

```bash
pnpm --filter supporter-product-data-typescript build
pnpm --filter supporter-product-data-typescript test
pnpm --filter supporter-product-data-typescript it-test
pnpm --filter supporter-product-data-typescript package
```

Run a local handler harness:

```bash
STAGE=CODE pnpm --filter supporter-product-data-typescript run:local
```

## Notes

- Lambda business logic is currently a parity scaffold, not a full production port yet.
- Next porting step is replacing placeholder handler logic with the Scala flow:
  - Query Zuora
  - Fetch CSV to S3
  - Queue records
  - Process queue records into Dynamo
