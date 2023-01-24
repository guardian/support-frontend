import { GuPlayApp } from "@guardian/cdk";
import { AccessScope } from "@guardian/cdk/lib/constants";
import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack, GuStringParameter } from "@guardian/cdk/lib/constructs/core";
import {
  GuAllowPolicy,
  GuGetS3ObjectsPolicy,
  GuPutCloudwatchMetricsPolicy,
} from "@guardian/cdk/lib/constructs/iam";
import type { GuAsgCapacity } from "@guardian/cdk/lib/types";
import { Duration } from "aws-cdk-lib";
import type { App } from "aws-cdk-lib";
import {
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

interface PaymentApiProps extends GuStackProps {
  domainName: string;
  scaling: GuAsgCapacity;
}

export class PaymentApi extends GuStack {
  constructor(scope: App, id: string, props: PaymentApiProps) {
    super(scope, id, props);

    const emailSqsCodeArn = new GuStringParameter(
      this,
      "EmailSqsQueueCodeArn",
      {
        description:
          "For the PROD stack you still need to supply this, because PROD instances need access to both PROD and CODE email queues.",
      }
    );

    const emailSqsProdArn = new GuStringParameter(
      this,
      "EmailSqsQueueProdArn",
      {
        description:
          "For the CODE stack you can leave this empty since it won't be used.  For the PROD stack you need to set it.",
      }
    );

    const ophanRole = new GuStringParameter(this, "OphanRole", {
      description: "ARN of the Ophan cross-account role",
    });

    const kinesisStreamArn = new GuStringParameter(this, "KinesisStreamArn", {
      description: "ARN of the kinesis stream to write events to",
    });

    const contributionsStoreSqsQueueCodeArn = new GuStringParameter(
      this,
      "ContributionsStoreSqsQueueCodeArn",
      {
        description:
          "For the PROD stack you still need to supply this, because PROD instances need access to both PROD and CODE contribution store queues.",
      }
    );

    const contributionsStoreSqsQueueProdArn = new GuStringParameter(
      this,
      "ContributionsStoreSqsQueueProdArn",
      {
        description:
          "For the CODE stack you can leave this empty since it won't be used.  For the PROD stack you need to set it.",
      }
    );

    const sqsKmsArn = new GuStringParameter(this, "SqsKmsArn", {
      description: "ARN of the KMS key for encrypting SQS data",
    });

    function environmentFromStage(stage: string) {
      return stage == "CODE" ? "DEV" : stage;
    }

    // TODO: Should these remain as cloudformation parameters?
    const projectName = "payment-api";
    const projectVersion = "0.1";

    const app = "payment-api";
    const userData = `#!/bin/bash -ev
    mkdir /etc/gu

    echo ${this.stage} > /etc/gu/stage

    aws --region ${this.region} s3 cp s3://membership-dist/${this.stack}/${this.stage}/${app}/${projectName}_${projectVersion}_all.deb /tmp
    dpkg -i /tmp/${projectName}_${projectVersion}_all.deb
    /opt/cloudwatch-logs/configure-logs application ${this.stack} ${this.stage} ${app} /var/log/${app}/application.log`;

    const playApp = new GuPlayApp(this, {
      app: "payment-api",
      access: { scope: AccessScope.PUBLIC },
      certificateProps: {
        domainName: props.domainName,
        hostedZoneId: "Z1E4V12LQGXFEC",
      },
      monitoringConfiguration: { noMonitoring: true },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
      scaling: props.scaling,
      userData,
      withoutImdsv2: true,
      roleConfiguration: {
        additionalPolicies: [
          new GuAllowPolicy(this, "SupporterProductDataDynamo", {
            actions: [
              "dynamodb:GetItem",
              "dynamodb:Scan",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
              "dynamodb:Query",
              "dynamodb:DescribeTable",
            ],
            resources: [
              `arn:aws:dynamodb:*:*:table/SupporterProductData-${environmentFromStage(
                this.stage
              )}`,
            ],
          }),

          new GuAllowPolicy(this, "CloudwatchLogs", {
            actions: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            // TODO: Should we use a more specific resource here?
            resources: ["arn:aws:logs:*:*:*"],
          }),
          new GuAllowPolicy(this, "SSMConfigParams", {
            actions: ["ssm:GetParametersByPath"],
            resources: [
              `arn:aws:ssm:${this.region}:${this.account}:parameter/${app}/*`,
            ],
          }),
          new GuAllowPolicy(this, "SqsMessages", {
            actions: ["sqs:GetQueueUrl", "sqs:SendMessage"],
            resources:
              this.stage === "PROD"
                ? [emailSqsCodeArn.valueAsString, emailSqsProdArn.valueAsString]
                : [emailSqsCodeArn.valueAsString],
          }),
          new GuPutCloudwatchMetricsPolicy(this),
          new GuAllowPolicy(this, "AssumeOphanRole", {
            actions: ["sts:AssumeRole"],
            resources: [ophanRole.valueAsString],
          }),
          new GuAllowPolicy(this, "KinesisPut", {
            actions: ["kinesis:*"],
            resources: [kinesisStreamArn.valueAsString],
          }),
          new GuAllowPolicy(this, "SQSPut", {
            actions: ["sqs:SendMessage"],
            resources:
              this.stage === "PROD"
                ? [
                    contributionsStoreSqsQueueCodeArn.valueAsString,
                    contributionsStoreSqsQueueProdArn.valueAsString,
                  ]
                : [contributionsStoreSqsQueueCodeArn.valueAsString],
          }),
          new GuAllowPolicy(this, "SqsKmsEncryption", {
            actions: ["kms:Encrypt"],
            resources: [sqsKmsArn.valueAsString],
          }),
          new GuGetS3ObjectsPolicy(this, "SettingsBucket", {
            bucketName: "support-admin-console",
            paths: this.stage === "PROD" ? ["*/*"] : ["CODE/*"],
          }),
        ],
      },
    });

    // ---- Alarms ---- //

    new GuAlarm(this, "NoHealthyInstancesAlarm", {
      app,
      alarmName: `[CDK] No healthy instances for ${app} in ${this.stage}`,
      actionsEnabled: props.stage === "PROD",
      threshold: 0.5,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "HealthyHostCount",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: playApp.loadBalancer.loadBalancerFullName,
          TargetGroup: playApp.targetGroup.targetGroupFullName,
        },
        statistic: "Average",
        period: Duration.seconds(60),
      }),
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "High5XXRateAlarm", {
      app,
      alarmName: `[CDK] High 5XX rate for ${app} in ${this.stage}`,
      actionsEnabled: props.stage === "PROD",
      threshold: 3,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "HTTPCode_Target_5XX_Count",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: playApp.loadBalancer.loadBalancerFullName,
          TargetGroup: playApp.targetGroup.targetGroupFullName,
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "NoPaypalPaymentsInTwoHours247Alarm", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} CP One-off contributions with PayPal might be down`,
      alarmDescription:
        "There have been no one-off contributions using paypal in the last 2 hours",
      actionsEnabled: props.stage === "PROD",
      threshold: 0,
      evaluationPeriods: 12,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "payment-success",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Paypal",
        },
        statistic: "Sum",
        period: Duration.seconds(600),
      }),
      treatMissingData: TreatMissingData.BREACHING,
      snsTopicName: "reader-revenue-24-7",
    });

    new GuAlarm(this, "NoStripePaymentsInThreeHours247Alarm", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} CP One-off contributions with Card might be down`,
      alarmDescription:
        "There have been no one-off contributions using card payment in the last 3 hours",
      actionsEnabled: props.stage === "PROD",
      threshold: 0,
      evaluationPeriods: 12,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "payment-success",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Stripe",
        },
        statistic: "Sum",
        period: Duration.seconds(900),
      }),
      treatMissingData: TreatMissingData.BREACHING,
      snsTopicName: "reader-revenue-24-7",
    });

    new GuAlarm(this, "NoPaypalPaymentsInOneHourAlarm", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} No successful paypal payments via payment-api for an hour`,
      actionsEnabled: props.stage === "PROD",
      threshold: 0,
      evaluationPeriods: 12,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "payment-success",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Paypal",
        },
        statistic: "Sum",
        period: Duration.seconds(300),
      }),
      treatMissingData: TreatMissingData.BREACHING,
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "NoStripePaymentsInOneHourAlarm", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} No successful stripe payments via payment-api for an hour`,
      actionsEnabled: props.stage === "PROD",
      threshold: 0,
      evaluationPeriods: 12,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "payment-success",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Stripe",
        },
        statistic: "Sum",
        period: Duration.seconds(300),
      }),
      treatMissingData: TreatMissingData.BREACHING,
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "PaypalPaymentError", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} Paypal payment error for one-off contribution via the payment-api`,
      actionsEnabled: props.stage === "PROD",
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: new Metric({
        metricName: "payment-error",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Paypal",
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "StripePaymentError", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} Stripe payment error for one-off contribution via the payment-api`,
      actionsEnabled: props.stage === "PROD",
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: new Metric({
        metricName: "payment-error",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Stripe",
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "AmazonPayPaymentError", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} Amazon Pay payment error for one-off contribution via the payment-api`,
      actionsEnabled: props.stage === "PROD",
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: new Metric({
        metricName: "payment-error",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "AmazonPay",
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "PostPaymentError", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} Failed post-payment task for one-off contribution via the payment-api`,
      actionsEnabled: props.stage === "PROD",
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: new Metric({
        metricName: "payment-error",
        namespace: "post-payment-tasks-error",
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "contributions-dev",
    });

    new GuAlarm(this, "StripeRateLimitingAlarm", {
      app,
      alarmName: `[CDK] ${app} ${this.stage} One or more requests have exceeded the rate limit for Stripe one-off contribution via the payment-api in the last 15 mins`,
      actionsEnabled: props.stage === "PROD",
      threshold: 0,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: new Metric({
        metricName: "stripe-rate-limit-exceeded",
        namespace: "support-payment-api-PROD",
        dimensionsMap: {
          "payment-provider": "Stripe",
        },
        statistic: "Sum",
        period: Duration.seconds(900),
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "contributions-dev",
    });
  }
}
