import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import type {App} from "aws-cdk-lib";
import { aws_events, aws_sqs, Duration } from "aws-cdk-lib";
import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { Archive, EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LoggingFormat, Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";

export interface BigqueryAcquisitionsPublisherProps extends GuStackProps {
  stack: string;
  stage: string;
  softOptInConsentSetterQueueArn: string;
}

const appName = "bigquery-acquisitions-publisher";

export class BigqueryAcquisitionsPublisher extends GuStack {
  constructor(scope: App, id: string, props: BigqueryAcquisitionsPublisherProps) {
    super(scope, id, props);

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

    const acquisitionsQueue = new Queue(this, `${appName}Queue`, {
      queueName,
      visibilityTimeout: Duration.minutes(2),
      deadLetterQueue: {
        // The number of times a message can be unsuccessfully dequeued before being moved to the dead-letter queue.
        // This has been set to 1 to avoid duplicate acquisition events being sent to bigquery
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
      targets: [new SqsQueue(acquisitionsQueue)],
    });

    const softOptInConsentSetterQueue =
      aws_sqs.Queue.fromQueueArn(this, "SoftOptInConsentSetterQueue", props.softOptInConsentSetterQueueArn)

    // Rule which passes events from support-workers on to soft opt-in queue
    new Rule(this, "SoftOptInToSQSRule", {
      description: "Send all events received via support-workers onto soft opt-in SQS queue",
      eventBus: eventBus,
      eventPattern: {
        region: ["eu-west-1"],
        source: ["support-workers.1"],
      },
      targets: [
        new SqsQueue(
          softOptInConsentSetterQueue,
          {
            message: aws_events.RuleTargetInput.fromObject({
              subscriptionId: aws_events.EventField.fromPath('$.detail.zuoraSubscriptionNumber'),
              identityId: aws_events.EventField.fromPath('$.detail.identityId'),
              eventType: "Acquisition",
              productName: aws_events.EventField.fromPath('$.detail.ZuoraProductName'),
              previousProductName: null
            }),
          },
        )
      ],
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

    const monitoring =
      this.stage == "PROD"
        ? {
            toleratedErrorPercentage: 0,
            snsTopicName: `alarms-handler-topic-${this.stage}`,
            alarmName: "big-query-acquisition-publisher lambda has failed",
            alarmDescription:
              "Check the logs for details https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fbigquery-acquisitions-publisher-PROD",
          }
        : undefined;

    // SQS to Lambda event source mapping
    const eventSource = new SqsEventSource(acquisitionsQueue, {
      reportBatchItemFailures: true,
    });

    const functionName = `${appName}-${props.stage}`;

    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.NODEJS_20_X,
      fileName: `index.zip`,
      functionName,
      handler: "index.handler",
      events: [eventSource],
      timeout: Duration.minutes(2),
      role,
      errorPercentageMonitoring: monitoring,
      loggingFormat: LoggingFormat.TEXT,
    });

    new GuAlarm(this, "DeadLetterQueueAlarm", {
      app: appName,
      alarmName: `The ${props.stage} ${appName} lambda has failed`,
      alarmDescription:
        `There is one or more event in the ${deadLetterQueueName} dead letter queue (DLQ). ` +
        "Check the logs for the error and use the details to confirm that the event was not written " +
        "to the fact_acquisition_event table in BigQuery. If the event is not in the table then use the DLQ " +
        "redrive feature to replay the failed event. If the redrive functionality is not used " +
        "then purge the queue instead or the alarm will remain in an alarm state.\n" +
        `Main queue: https://eu-west-1.console.aws.amazon.com/sqs/v2/home?region=eu-west-1#/queues/https%3A%2F%2Fsqs.eu-west-1.amazonaws.com%2F865473395570%2F${queueName}\n` +
        `DLQ: https://eu-west-1.console.aws.amazon.com/sqs/v2/home?region=eu-west-1#/queues/https%3A%2F%2Fsqs.eu-west-1.amazonaws.com%2F865473395570%2F${deadLetterQueueName}\n` +
        `Logs: https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${functionName}`,
      metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.IGNORE,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      actionsEnabled: this.stage === "PROD",
    });
  }
}
