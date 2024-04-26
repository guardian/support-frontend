import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack, GuStringParameter } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { Archive, EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import {AccountPrincipal, Effect, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";

const appName = "bigquery-acquisitions-publisher";

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const mobileAccountId = new GuStringParameter(this, 'MobileAccountId', {
      description: 'ID of the mobile aws account',
    });

    const busName = `acquisitions-bus-${props.stage}`;

    // Event bus
    const eventBus = new EventBus(this, busName, {
      eventBusName: busName,
    });

    new Archive(this, `${busName}-archive`, {
      eventPattern: {
        account: ["account"],
        region: ["eu-west-1"],
      },
      sourceEventBus: eventBus,
      archiveName: `${busName}-archive`,
      description: `Archive for all events sent to ${busName}-archive`,
      retention: Duration.days(90),
    });

    // SQS Queues
    const queueName = `${appName}-queue-${props.stage}`;
    const deadLetterQueueName = `dead-letters-${appName}-${props.stage}`;

    const deadLetterQueue = new Queue(this, `dead-letters-${appName}Queue`, {
      queueName: deadLetterQueueName,
      retentionPeriod: Duration.days(14),
    });

    const queue = new Queue(this, `${appName}Queue`, {
      queueName,
      visibilityTimeout: Duration.minutes(2),
      deadLetterQueue: {
        // The number of times a message can be unsuccessfully dequeued before being moved to the dead-letter queue.
        // This has been set to 1 to avoid duplicate acquisition events being send to bigquery
        maxReceiveCount: 1,
        queue: deadLetterQueue,
      },
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

    const mobileEventBusPutRole = new Role(this, "mobile-event-bus-put-role", {
      roleName: `${this.stack}-cross-account-role-${this.stage}`,
      assumedBy: new AccountPrincipal(mobileAccountId.valueAsString),
    })
    mobileEventBusPutRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [eventBus.eventBusArn],
        actions: ["events:PutEvents"],
      })
    );

    const monitoring =
      this.stage == "PROD"
        ? {
            toleratedErrorPercentage: 0,
            snsTopicName: "conversion-dev",
            alarmName: "big-query-acquisition-publisher lambda has failed",
            alarmDescription:
              "Check the logs for details https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fbigquery-acquisitions-publisher-PROD",
          }
        : undefined;

    // SQS to Lambda event source mapping
    const eventSource = new SqsEventSource(queue, {
      reportBatchItemFailures: true,
    });

    const functionName = `${appName}-${props.stage}`;

    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.JAVA_21,
      fileName: `${appName}.jar`,
      functionName,
      handler: "com.gu.bigqueryAcquisitionsPublisher.Lambda::handler",
      events: [eventSource],
      timeout: Duration.minutes(2),
      role,
      errorPercentageMonitoring: monitoring,
    });

    new GuAlarm(this, "DeadLetterQueueAlarm", {
      app: appName,
      alarmName: `The ${props.stage} big-query-acquisitions-publisher lambda has failed`,
      alarmDescription:
        `There is one or more event in the ${deadLetterQueueName} dead letter queue. ` +
        "Check the logs for details of the exception and then use the dead letter queue redrive functionality " +
        "to replay the failed event if appropriate. If the redrive functionality is not used then purge the queue " +
        "instead or the alarm will remain in an alarm state and not send this email again in future.\n" +
        `The main queue is at https://eu-west-1.console.aws.amazon.com/sqs/v2/home?region=eu-west-1#/queues/https%3A%2F%2Fsqs.eu-west-1.amazonaws.com%2F865473395570%2F${queueName}\n` +
        `The dead letter queue is at https://eu-west-1.console.aws.amazon.com/sqs/v2/home?region=eu-west-1#/queues/https%3A%2F%2Fsqs.eu-west-1.amazonaws.com%2F865473395570%2F${deadLetterQueueName}\n` +
        `Logs are at https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${functionName}`,
      metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.IGNORE,
      snsTopicName: "contributions-dev",
      actionsEnabled: this.stage === "PROD",
    });
  }
}
