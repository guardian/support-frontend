import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { type App, Duration, Size } from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class ItTestRunnerDocker extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    // This tag comes from the environment variable set in GitHub Actions
    const imageTag = process.env.IT_TEST_RUNNER_IMAGE_TAG ?? "latest";

    // Reference the repository you pushed to
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "Repo",
      "support-workers-it-test-runner"
    );

    new lambda.DockerImageFunction(this, "ItTestRunner", {
      code: lambda.DockerImageCode.fromEcr(repository, {
        tagOrDigest: imageTag,
      }),
      memorySize: 4096,
      ephemeralStorageSize: Size.gibibytes(10),
      timeout: Duration.minutes(15),
      environment: {
        STAGE: props.stage || "CODE",
      },
    });
  }
}
