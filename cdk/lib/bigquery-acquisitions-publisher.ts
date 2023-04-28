import type { GuStackProps} from '@guardian/cdk/lib/constructs/core';
import {GuStack} from '@guardian/cdk/lib/constructs/core';
import {GuLambdaFunction} from '@guardian/cdk/lib/constructs/lambda';
import type {App} from 'aws-cdk-lib';
import {Duration} from "aws-cdk-lib";
import {PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {Queue} from "aws-cdk-lib/aws-sqs";

const appName = 'bigquery-acquisitions-publisher';

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const queue = new Queue(this, `${appName}Queue`, {
      queueName: `${appName}-queue-${props.stage}`,
      visibilityTimeout: Duration.minutes(2),
    })
    const eventSource = new SqsEventSource(queue);

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
