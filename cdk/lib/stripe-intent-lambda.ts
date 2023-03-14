import type { GuStackProps} from "@guardian/cdk/lib/constructs/core";
import {GuStack} from "@guardian/cdk/lib/constructs/core";
import {GuLambdaFunction} from "@guardian/cdk/lib/constructs/lambda";
import type {App} from "aws-cdk-lib";
import { Duration} from "aws-cdk-lib";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Runtime} from "aws-cdk-lib/aws-lambda";

type StripeIntentLambdaProps = GuStackProps

export class StripeIntentLambda extends GuStack {
  constructor(scope: App, id: string, props: StripeIntentLambdaProps) {
    super(scope, id, props);

    const stripeConfig = this.stage === 'PROD' ? 'live' : 'test';

    new GuLambdaFunction(this, 'stripe-intent-lambda', {
      app: 'stripe-intent-lambda',
      handler: 'com.gu.stripeIntent.Handler::handleRequest',
      functionName: `stripe-intent-${this.stage}`,
      runtime: Runtime.JAVA_8,
      fileName: 'stripe-intent.jar',
      timeout: Duration.seconds(300),
      memorySize: 2048,
      environment: {
        Stage: this.stage,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: [
            's3:GetObject',
          ],
          effect: Effect.ALLOW,
          resources: [`arn:aws:s3:::gu-reader-revenue-private/stripe/${stripeConfig}-stripe-regular.private.conf`],
        }),
      ],
      errorPercentageMonitoring: {
        toleratedErrorPercentage: 0,
        snsTopicName: `arn:aws:sns:${this.region}:${this.account}:reader-revenue-dev`
      }
    });
  }
}
