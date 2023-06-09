import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { CfnIntegration, CfnRoute } from "aws-cdk-lib/aws-apigatewayv2";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { CloudWatchLogGroup, SqsQueue } from "aws-cdk-lib/aws-events-targets";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Queue } from "aws-cdk-lib/aws-sqs";

const appName = "bigquery-acquisitions-publisher";

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const busName = `acquisitions-bus-${props.stage}`;

    // Event bus
    const eventBus = new EventBus(this, busName, {
      eventBusName: busName,
    });

    // // Event logger
    // const logGroup = new LogGroup(this, "EventLogGroup", {
    //   logGroupName: `/aws/events/${busName}`,
    // });
    //
    // const cloudWatchLogGroup = new CloudWatchLogGroup(logGroup);
    //
    // // Rule which sends events to the logGroup
    // new Rule(this, "EventLoggerRule", {
    //   description: "Log all events",
    //   eventPattern: {
    //     region: ["eu-west-1"],
    //   },
    //   eventBus: eventBus,
    //   targets: [cloudWatchLogGroup],
    // });

    // Api Gateway and Eventbridge integration
    const httpApi = new HttpApi(
      this,
      `acquisitions-eventbridge-api-${props.stage}`
    );

    // There's no Eventbridge integration available as CDK L2 yet, so we have to use L1 and create Role, Integration and Route
    const apiRole = new Role(this, "EventBridgeIntegrationRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    apiRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [eventBus.eventBusArn],
        actions: ["events:PutEvents"],
      })
    );

    const eventBridgeIntegration = new CfnIntegration(
      this,
      "EventBridgeIntegration",
      {
        apiId: httpApi.httpApiId,
        integrationType: "AWS_PROXY",
        integrationSubtype: "EventBridge-PutEvents",
        credentialsArn: apiRole.roleArn,
        requestParameters: {
          Source: "ApiGateway",
          DetailType: "AcquisitionsEvent",
          Detail: "$request.body",
          EventBusName: eventBus.eventBusArn,
        },
        payloadFormatVersion: "1.0",
        timeoutInMillis: 10000,
      }
    );

    new CfnRoute(this, "EventRoute", {
      apiId: httpApi.httpApiId,
      routeKey: "POST /",
      target: `integrations/${eventBridgeIntegration.ref}`,
    });

    // SQS Queue
    const queue = new Queue(this, `${appName}Queue`, {
      queueName: `${appName}-queue-${props.stage}`,
      visibilityTimeout: Duration.minutes(2),
      // TODO - dead letter queue?
    });

    // Rule which passes events on to SQS
    new Rule(this, "EventBusToSQSRule", {
      description: "Send all events to SQS",
      eventPattern: {
        region: ["eu-west-1"],
      },
      eventBus: eventBus,
      targets: [new SqsQueue(queue)],
    });

    const eventSource = new SqsEventSource(queue);

    // Create a custom role because the name needs to be short, otherwise the request to Google Cloud fails
    const role = new Role(this, "bigquery-to-s3-role", {
      roleName: `bq-acq-${this.stage}`,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"],
      })
    );
    role.addToPolicy(
      new PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/${appName}/${props.stage}/gcp-wif-credentials-config`,
        ],
      })
    );

    // TODO - alarms
    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.JAVA_8_CORRETTO,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${props.stage}`,
      handler: "com.gu.bigqueryAcquisitionsPublisher.Lambda::handler",
      events: [eventSource],
      timeout: Duration.minutes(2),
      role,
    });
  }
}
