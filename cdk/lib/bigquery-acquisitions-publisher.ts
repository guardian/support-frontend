import {GuStack, GuStackProps} from '@guardian/cdk/lib/constructs/core';
import {App} from 'aws-cdk-lib';
import {GuLambdaFunction} from '@guardian/cdk/lib/constructs/lambda';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {Queue} from "aws-cdk-lib/aws-sqs";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";

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
