import type { GuStackProps} from '@guardian/cdk/lib/constructs/core';
import {GuStack} from '@guardian/cdk/lib/constructs/core';
import {GuLambdaFunction} from '@guardian/cdk/lib/constructs/lambda';
import type {App} from 'aws-cdk-lib';
import {CfnOutput, Duration} from "aws-cdk-lib";
import {Effect, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {Queue} from "aws-cdk-lib/aws-sqs";
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import {CloudWatchLogGroup} from "aws-cdk-lib/aws-events-targets";
import { CfnIntegration, CfnRoute } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
const appName = 'bigquery-acquisitions-publisher';

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    // Event bus
    const eventBus = new EventBus(this, 'acquisitions-bus', {
      eventBusName: 'AcquisitionsBus',
    });

    // Event logger
    const eventLoggerRule = new Rule(this, "EventLoggerRule", {
      description: "Log all events",
      eventPattern: {
        region: [ "eu-west-1" ]
      },
      eventBus: eventBus
    });

    const logGroup = new LogGroup(this, 'EventLogGroup', {
      logGroupName: '/aws/events/acquisitions-bus',
    });

    eventLoggerRule.addTarget(new CloudWatchLogGroup(logGroup));

    // Api
    const httpApi = new HttpApi(this, 'MyHttpApi');

    /* There's no Eventbridge integration available as CDK L2 yet, so we have to use L1 and create Role, Integration and Route */
    const apiRole = new Role(this, 'EventBridgeIntegrationRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    apiRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [eventBus.eventBusArn],
        actions: ['events:PutEvents'],
      })
    );

    const eventbridgeIntegration = new CfnIntegration(
      this,
      'EventBridgeIntegration',
      {
        apiId: httpApi.httpApiId,
        integrationType: 'AWS_PROXY',
        integrationSubtype: 'EventBridge-PutEvents',
        credentialsArn: apiRole.roleArn,
        requestParameters: {
          Source: 'WebApp',
          DetailType: 'MyDetailType',
          Detail: '$request.body',
          EventBusName: eventBus.eventBusArn,
        },
        payloadFormatVersion: '1.0',
        timeoutInMillis: 10000,
      }
    );

    new CfnRoute(this, 'EventRoute', {
      apiId: httpApi.httpApiId,
      routeKey: 'POST /',
      target: `integrations/${eventbridgeIntegration.ref}`,
    });

    new CfnOutput(this, 'apiUrl', { value: httpApi.url!, description: "HTTP API endpoint URL" });


    // Queue
    const queue = new Queue(this, `${appName}Queue`, {
      queueName: `${appName}-queue-${props.stage}`,
      visibilityTimeout: Duration.minutes(2),
      // TODO - dead letter queue?
    })
    const eventSource = new SqsEventSource(queue);

    // Create a custom role because the name needs to be short, otherwise the request to Google Cloud fails
    const role = new Role(this, 'bigquery-to-s3-role', {
      roleName: `bq-acq-${this.stage}`,
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: ['*'],
      }),
    );
    role.addToPolicy(
      new PolicyStatement({
        actions: ['ssm:GetParameter'],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/${appName}/${props.stage}/gcp-wif-credentials-config`,
        ],
      }),
    );

    // TODO - alarms
    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.JAVA_8_CORRETTO,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${props.stage}`,
      handler: 'com.gu.bigqueryAcquisitionsPublisher.Lambda::handler',
      events: [eventSource],
      timeout: Duration.minutes(2),
      role,
    });
  }
}
