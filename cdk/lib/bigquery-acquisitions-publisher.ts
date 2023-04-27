import type { GuStackProps} from '@guardian/cdk/lib/constructs/core';
import {GuStack} from '@guardian/cdk/lib/constructs/core';
import {GuLambdaFunction} from '@guardian/cdk/lib/constructs/lambda';
import type {App} from 'aws-cdk-lib';
import {Duration} from "aws-cdk-lib";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {Queue} from "aws-cdk-lib/aws-sqs";

const appName = 'bigquery-acquisitions-publisher';

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const queue = new Queue(this, `${appName}Queue`, {
      queueName: `${appName}-queue-${props.stage}`
    })
    const eventSource = new SqsEventSource(queue);

    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.JAVA_8_CORRETTO,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${props.stage}`,
      handler: 'com.gu.bigqueryAcquisitionsPublisher.Lambda::handler',
      events: [eventSource],
      timeout: Duration.minutes(2),
      initialPolicy: [
        new PolicyStatement({
          actions: ["ssm:GetParameter"],
          resources: [
            `arn:aws:ssm:${this.region}:${this.account}:parameter/${appName}/${props.stage}/gcp-wif-credentials-config`,
          ],
        })
      ]
    });
  }
}
