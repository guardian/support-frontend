import { GuApiGatewayWithLambdaByPath, GuScheduledLambda } from "@guardian/cdk";
import type {
  GuLambdaErrorPercentageMonitoringProps, NoMonitoring,
} from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { Schedule } from "aws-cdk-lib/aws-events";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import type { CfnFunction} from "aws-cdk-lib/aws-lambda";
import { Runtime } from "aws-cdk-lib/aws-lambda";

// enable Snapstart for faster lambda starts
function enableSnapstart(lambda: GuLambdaFunction): void {
  (lambda.node.defaultChild as CfnFunction).snapStart = { applyOn: "PublishedVersions" };
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
      `arn:aws:dynamodb:*:*:table/SupporterProductData-${stage}`,
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
  constructor(scope: GuStack, id: string, appName: string, buildNumber: string) {
    super(scope, id, {
      app: appName,
      fileName: `${appName}-${buildNumber}.jar`,
      functionName: `${appName}-${scope.stage}`,
      handler:
        "com.gu.patrons.lambdas.ProcessStripeSubscriptionsLambda::handleRequest",
      monitoringConfiguration: monitoringForEnvironment(scope.stage),
      rules: [{ schedule: scheduleRateForEnvironment(scope.stage) }],
      runtime: Runtime.JAVA_11,
      memorySize: 1536,
      timeout: Duration.minutes(15),
      enableVersioning: true,
    });

    enableSnapstart(this);

    function monitoringForEnvironment(
      stage: string
    ): NoMonitoring | GuLambdaErrorPercentageMonitoringProps {
      if (stage == "PROD") {
        return {
          alarmName: `${appName}-${stage}-ErrorAlarm`,
          alarmDescription: `Triggers if there are errors from ${appName} on ${stage}`,
          snsTopicName: "reader-revenue-dev",
          toleratedErrorPercentage: 1,
          lengthOfEvaluationPeriod: Duration.minutes(1),
          numberOfEvaluationPeriodsAboveThresholdBeforeAlarm: 46,
        };
      }
      return { noMonitoring: true };
    }

    function scheduleRateForEnvironment(stage: string) {
      return Schedule.rate(Duration.minutes(stage == "PROD" ? 30 : 24 * 60));
    }

    this.addToRolePolicy(parameterStorePolicy(scope, appName));
    this.addToRolePolicy(dynamoPolicy(scope.stage));
  }
}

class PatronSignUpLambda extends GuLambdaFunction {
  constructor(scope: GuStack, id: string, appName: string, buildNumber: string) {
    super(scope, `${appName}-sign-up`, {
      app: appName,
      fileName: `${appName}-${buildNumber}.jar`,
      functionName: `${appName}-sign-up-${scope.stage}`,
      handler:
        "com.gu.patrons.lambdas.PatronSignUpEventLambda::handleRequest",
      runtime: Runtime.JAVA_11,
      memorySize: 1536,
      timeout: Duration.minutes(15),
      enableVersioning: true,
    });

    enableSnapstart(this);

    this.addToRolePolicy(parameterStorePolicy(scope, appName));
    this.addToRolePolicy(dynamoPolicy(scope.stage));
  }
}

class PatronCancelledLambda extends GuLambdaFunction {
  constructor(scope: GuStack, id: string, appName: string, buildNumber: string) {
    super(scope, `${appName}-cancelled`, {
      app: appName,
      fileName: `${appName}-${buildNumber}.jar`,
      functionName: `${appName}-cancelled-${scope.stage}`,
      handler:
        "com.gu.patrons.lambdas.PatronCancelledEventLambda::handleRequest",
      runtime: Runtime.JAVA_11,
      memorySize: 1536,
      timeout: Duration.minutes(15),
      enableVersioning: true,
    });

    enableSnapstart(this);

    this.addToRolePolicy(parameterStorePolicy(scope, appName));
    this.addToRolePolicy(dynamoPolicy(scope.stage));
  }
}

export interface StripePatronsDataProps extends GuStackProps {
  // We use the buildNumber to set the lambda fileName, because lambda versioning requires a new fileName each time
  buildNumber: string;
}

export class StripePatronsData extends GuStack {
  constructor(scope: App, id: string, props: StripePatronsDataProps) {
    super(scope, id, props);

    const appName = "stripe-patrons-data";

    new StripePatronsDataLambda(this, id, appName, props.buildNumber);

    const patronCancelledLambda = new PatronCancelledLambda(this, id, appName, props.buildNumber);
    const patronSignUpLambda = new PatronSignUpLambda(this, id, appName, props.buildNumber);

    // Wire up the API
    new GuApiGatewayWithLambdaByPath(this, {
      app: appName,
      targets: [
        {
          path: "patron/subscription/cancel/{countryId}",
          httpMethod: "POST",
          lambda: patronCancelledLambda,
        },
        {
          path: "patron/subscription/create/{countryId}",
          httpMethod: "POST",
          lambda: patronSignUpLambda,
        },
      ],
      // Create an alarm
      monitoringConfiguration: {
        snsTopicName: "reader-revenue-dev",
        http5xxAlarm: {
          tolerated5xxPercentage: 1,
        },
      },
    });
  }
}
