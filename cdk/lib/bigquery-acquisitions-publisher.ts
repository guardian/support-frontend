import type { GuStackProps} from '@guardian/cdk/lib/constructs/core';
import {GuStack} from '@guardian/cdk/lib/constructs/core';
import {GuLambdaFunction} from '@guardian/cdk/lib/constructs/lambda';
import type {App} from 'aws-cdk-lib';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {Queue} from "aws-cdk-lib/aws-sqs";

const appName = 'BigqueryAcquisitionsPublisher';

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const queue = new Queue(this, `${appName}Queue`, {
      queueName: `${appName}Queue`
    })
    const eventSource = new SqsEventSource(queue);

    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.JAVA_11,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${props.stage}`,
      handler: 'com.gu.bigqueryAcquisitionsPublisher::handleRequest',
      events: [eventSource],
    });
  }
}
