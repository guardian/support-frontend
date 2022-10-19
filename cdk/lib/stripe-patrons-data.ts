import { GuApiGatewayWithLambdaByPath, GuScheduledLambda } from "@guardian/cdk";
import type {
  GuLambdaErrorPercentageMonitoringProps,
  NoMonitoring,
} from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { Schedule } from "aws-cdk-lib/aws-events";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";

function environmentFromStage(stage: string) {
  return stage == "CODE" ? "DEV" : stage;
}

function dynamoPolicy(stage: string) {
  return new PolicyStatement({
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
        stage
      )}`,
    ],
  });
}

function parameterStorePolicy(scope: GuStack, appName: string) {
  return new PolicyStatement({
    actions: ["ssm:GetParametersByPath"],
    resources: [
      `arn:aws:ssm:${scope.region}:${scope.account}:parameter/${scope.stage}/support/${appName}/*`,
    ],
  });
}

class StripePatronsDataLambda extends GuScheduledLambda {
  constructor(scope: GuStack, id: string, appName: string) {
    super(scope, id, {
      app: appName,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${scope.stage}`,
      handler:
        "com.gu.patrons.lambdas.ProcessStripeSubscriptionsLambda::handleRequest",
      monitoringConfiguration: monitoringForEnvironment(scope.stage),
      rules: [{ schedule: scheduleRateForEnvironment(scope.stage) }],
      runtime: Runtime.JAVA_11,
      timeout: Duration.minutes(15),
    });

    function monitoringForEnvironment(
      stage: string
    ): NoMonitoring | GuLambdaErrorPercentageMonitoringProps {
      if (stage == "PROD") {
        return {
          alarmName: `${appName}-${stage}-ErrorAlarm`,
          alarmDescription: `Triggers if there are errors from ${appName} on ${stage}`,
          snsTopicName: "reader-revenue-dev",
          toleratedErrorPercentage: 1,
          numberOfMinutesAboveThresholdBeforeAlarm: 46, // The lambda runs every 15 mins so alarm if it fails 3 times in a row
        };
      }
      return { noMonitoring: true };
    }

    function scheduleRateForEnvironment(stage: string) {
      return Schedule.rate(Duration.minutes(stage == "PROD" ? 15 : 60));
    }

    this.addToRolePolicy(parameterStorePolicy(scope, appName));
    this.addToRolePolicy(dynamoPolicy(scope.stage));
  }
}

class PatronCancelledLambda extends GuLambdaFunction {
  constructor(scope: GuStack, id: string, appName: string) {
    super(scope, `${appName}-cancelled`, {
      app: appName,
      fileName: `${appName}.jar`,
      functionName: `${appName}-cancelled-${scope.stage}`,
      handler:
        "com.gu.patrons.lambdas.PatronCancelledEventLambda::handleRequest",
      runtime: Runtime.JAVA_11,
      timeout: Duration.minutes(15),
    });
  }
}

export class StripePatronsData extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const appName = "stripe-patrons-data";

    new StripePatronsDataLambda(this, id, appName);

    const patronCancelledLambda = new PatronCancelledLambda(this, id, appName);

    // Wire up the API
    new GuApiGatewayWithLambdaByPath(this, {
      app: "example-api-gateway-instance",
      targets: [
        {
          path: "patron/subscription/cancel/{countryId}",
          httpMethod: "POST",
          lambda: patronCancelledLambda,
        },
      ],
      // Create an alarm
      monitoringConfiguration: {
        snsTopicName: "my-topic-for-cloudwatch-alerts",
        http5xxAlarm: {
          tolerated5xxPercentage: 1,
        },
      },
    });
  }
}
