import { Schedule } from "@aws-cdk/aws-events";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Runtime } from "@aws-cdk/aws-lambda";
import type { App } from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";
import { GuScheduledLambda } from "@guardian/cdk";
import type {
  GuLambdaErrorPercentageMonitoringProps,
  NoMonitoring,
} from "@guardian/cdk/lib/constructs/cloudwatch";
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
        "com.gu.patrons.lambdas.ProcessStripeSubscriptionsLambda::handleRequest",
      monitoringConfiguration: monitoringForEnvironment(scope.stage),
      rules: [{ schedule: scheduleRateForEnvironment(scope.stage) }],
      runtime: Runtime.JAVA_11,
    });

    function monitoringForEnvironment(
      stage: string
    ): NoMonitoring | GuLambdaErrorPercentageMonitoringProps {
      if (stage == "PROD")
        return {
          alarmName: `${appName}-${scope.stage}-ErrorAlarm`,
          alarmDescription: `Triggers if there are errors from ${appName} on ${scope.stage}`,
          snsTopicName: "reader-revenue-dev",
          toleratedErrorPercentage: 1,
          numberOfMinutesAboveThresholdBeforeAlarm: 1,
        };
      return { noMonitoring: true };
    }

    function environmentFromStage(stage: string) {
      return stage == "CODE" ? "DEV" : stage;
    }

    function scheduleRateForEnvironment(stage: string) {
      return Schedule.rate(Duration.minutes(stage == "PROD" ? 15 : 60));
    }

    this.addToRolePolicy(
      new PolicyStatement({
        actions: ["ssm:GetParametersByPath"],
        resources: [
          `arn:aws:ssm:${scope.region}:${scope.account}:parameter/${scope.stage}/support/${appName}/*`,
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
