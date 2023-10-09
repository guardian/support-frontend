import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import {
  Alarm,
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { Archive, EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
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
    const deadLetterQueue = new Queue(this, `dead-letters-${appName}Queue`, {
      queueName: `dead-letters-${appName}-${props.stage}`,
    });

    const queue = new Queue(this, `${appName}Queue`, {
      queueName: `${appName}-queue-${props.stage}`,
      visibilityTimeout: Duration.minutes(2),
      deadLetterQueue: {
        // The number of times a message can be unsuccessfully dequeued before being moved to the dead-letter queue.
        // This has been set to 1 to avoid duplicate acquisition events being send to bigquery
        maxReceiveCount: 1,
        queue: deadLetterQueue,
      },
    });

    new Alarm(this, "DeadLetterQueueAlarm", {
      alarmDescription: `Alarm for dead letter ${deadLetterQueue.queueName}`,
      metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.IGNORE,
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

    new GuLambdaFunction(this, `${appName}Lambda`, {
      app: appName,
      runtime: Runtime.JAVA_8_CORRETTO,
      fileName: `${appName}.jar`,
      functionName: `${appName}-${props.stage}`,
      handler: "com.gu.bigqueryAcquisitionsPublisher.Lambda::handler",
      events: [eventSource],
      timeout: Duration.minutes(2),
      role,
      errorPercentageMonitoring: monitoring,
    });
  }
}
