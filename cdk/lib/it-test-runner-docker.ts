import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { type App, Duration, Size } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class ItTestRunnerDocker extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);
    new lambda.DockerImageFunction(this, "PnpmTestRunner", {
      code: lambda.DockerImageCode.fromImageAsset(
        "../support-lambdas/it-test-runner-docker"
      ),
      // Increase memory for faster CPU/Install speeds
      memorySize: 4096,
      // Configure up to 10GB of /tmp space
      ephemeralStorageSize: Size.gibibytes(10),
      timeout: Duration.minutes(15),
      environment: {
        STAGE: props.stage || "CODE",
      },
    });
  }
}
