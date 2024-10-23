import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import {
  type GuFunctionProps,
  GuLambdaFunction,
} from "@guardian/cdk/lib/constructs/lambda";
import { type App, Duration, Fn } from "aws-cdk-lib";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { DefinitionBody, StateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";

interface SupportWorkersProps extends GuStackProps {
  promotionsDynamoTables: string[];
  s3Files: string[];
  supporterProductDataTables: string[];
  kinesisStreamArn: string;
  eventBusArns: string[];
}
export class SupportWorkers extends GuStack {
  constructor(scope: App, id: string, props: SupportWorkersProps) {
    super(scope, id, props);

    const app = "support-workers";

    const bucket = new Bucket(this, "Bucket", {
      bucketName: `${app}-${this.stage.toLowerCase()}`,
    });

    const snsTopicArn = `arn:aws:sns:${this.region}:${this.account}:alarms-handler-topic-${this.stage}`;

    const lambdaDefaultConfig: Pick<
      GuFunctionProps,
      "app" | "memorySize" | "fileName" | "runtime" | "timeout" | "environment"
    > = {
      app,
      memorySize: 1024,
      fileName: `support-workers.jar`,
      runtime: Runtime.JAVA_21,
      timeout: Duration.seconds(300),
      environment: {
        APP: app,
        STACK: this.stack,
        STAGE: this.stage,
        SENTRY_DSN:
          "https://55945d73ad654abd856d1523de4f9d56:cf9b33aaff3c483899dfa986abce55df@sentry.io/1212214",
        SENTRY_ENVIRONMENT: this.stage,
        GU_SUPPORT_WORKERS_STAGE: this.stage,
        EMAIL_QUEUE_NAME: Fn.importValue(`comms-${this.stage}-EmailQueueName`),
      },
    };

    // const lambdaExecutionRole = new Role(this, "LambdaExecutionRole", {
    //   assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    //
    // });
    const s3Policy = new PolicyStatement({
      actions: ["s3:GetObject"],
      resources: props.s3Files,
    });
    const sqsPolicy = new PolicyStatement({
      actions: ["sqs:GetQueueUrl", "sqs:SendMessage"],
      resources: [`comms-${this.stage}-EmailQueueArn`],
    });
    const eventBusPolicy = new PolicyStatement({
      actions: ["events:PutEvents"],
      resources: props.eventBusArns,
    });
    const cloudWatchLoggingPolicy = new PolicyStatement({
      actions: [
        "logs:Create*",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams",
        "cloudwatch:putMetricData",
      ],
      resources: ["*"],
    });
    const kinesisPolicy = new PolicyStatement({
      actions: ["kinesis:*"],
      resources: [props.kinesisStreamArn],
    });
    const promotionsDynamoTablePolicy = new PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:DescribeTable",
      ],
      resources: props.promotionsDynamoTables,
    });
    const supporterProductDataTablePolicy = new PolicyStatement({
      actions: ["dynamodb:PutItem", "dynamodb:UpdateItem"],
      resources: props.supporterProductDataTables,
    });

    const preparePaymentMethodForReuse = new LambdaInvoke(
      this,
      "PreparePaymentMethodForReuseLambdaInvoke",
      {
        lambdaFunction: new GuLambdaFunction(
          this,
          "PreparePaymentMethodForReuseLambda",
          {
            ...lambdaDefaultConfig,
            handler:
              "com.gu.support.workers.lambdas.PreparePaymentMethodForReuse::handleRequest",
            functionName: `${this.stack}-PreparePaymentMethodForReuseLambda-${this.stage}`,
            environment: {
              ...lambdaDefaultConfig.environment,
            },
            initialPolicy: [s3Policy, cloudWatchLoggingPolicy],
          }
        ),
      }
    );

    const stateMachine = new StateMachine(this, "SupportWorkers", {
      stateMachineName: `${app}-${this.stage}`,
      definitionBody: DefinitionBody.fromChainable(
        preparePaymentMethodForReuse
      ),
    });

    stateMachine.role.attachInlinePolicy(
      new Policy(
        this,
        "SalesforceDisasterRecoveryStateMachineRoleAdditionalPolicy",
        {
          statements: [
            new PolicyStatement({
              actions: [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret",
              ],
              resources: [
                `arn:aws:secretsmanager:${this.region}:${this.account}:secret:events!connection/${app}-${this.stage}-salesforce-api/*`,
              ],
            }),
            new PolicyStatement({
              actions: ["s3:GetObject", "s3:PutObject"],
              resources: [bucket.arnForObjects("*")],
            }),
            new PolicyStatement({
              actions: ["states:StartExecution"],
              resources: [stateMachine.stateMachineArn],
            }),
            new PolicyStatement({
              actions: [
                "states:RedriveExecution",
                "states:DescribeExecution",
                "states:StopExecution",
              ],
              resources: [
                `arn:aws:states:${this.region}:${this.account}:execution:${stateMachine.stateMachineName}/*`,
              ],
            }),
            new PolicyStatement({
              actions: ["sns:Publish"],
              resources: [snsTopicArn],
            }),
          ],
        }
      )
    );
  }
}
