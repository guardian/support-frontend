import { Schedule } from "@aws-cdk/aws-events";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Runtime } from "@aws-cdk/aws-lambda";
import type { App } from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";
import { GuScheduledLambda } from "@guardian/cdk";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";

class StripePatronsDataLambda extends GuScheduledLambda {
  constructor(scope: GuStack, id: string) {
    const appName = "stripe-patrons-data";
    super(scope, id, {
      app: appName,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${scope.stage}`,
      handler:
        "com.gu.patrons.lambdas.FetchStripeSubscriptionsLambda::handleRequest",
      monitoringConfiguration: { noMonitoring: true },
      rules: [{ schedule: Schedule.rate(Duration.minutes(10)) }],
      runtime: Runtime.JAVA_11,
      environment: {
        Stage: scope.stage,
      },
    });

    function environmentFromStage(stage: string) {
      return stage == "CODE" ? "DEV" : stage;
    }

    this.addToRolePolicy(
      new PolicyStatement({
        actions: ["ssm:GetParametersByPath"],
        resources: [
          `arn:aws:ssm:${scope.region}:${scope.account}:parameter/${scope.stack}/${scope.stage}`,
        ],
      })
    );
    this.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:DescribeTable",
        ],
        resources: [
          `arn:aws:dynamodb:*:*:table/SupporterProductData-${environmentFromStage(
            scope.stage
          )}`,
        ],
      })
    );
  }
}

export class StripePatronsData extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    new StripePatronsDataLambda(this, id);
  }
}
