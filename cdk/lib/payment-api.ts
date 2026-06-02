import { GuPlayApp } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import { GuAlarm } from '@guardian/cdk/lib/constructs/cloudwatch';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack, GuStringParameter } from '@guardian/cdk/lib/constructs/core';
import {
	GuAllowPolicy,
	GuGetS3ObjectsPolicy,
	GuPutCloudwatchMetricsPolicy,
} from '@guardian/cdk/lib/constructs/iam';
import type { GuAsgCapacity } from '@guardian/cdk/lib/types';
import { Duration } from 'aws-cdk-lib';
import type { App } from 'aws-cdk-lib';
import {
	ComparisonOperator,
	MathExpression,
	Metric,
	TreatMissingData,
} from 'aws-cdk-lib/aws-cloudwatch';
import {
	InstanceClass,
	InstanceSize,
	InstanceType,
	UserData,
} from 'aws-cdk-lib/aws-ec2';
import {
	ApplicationListenerRule,
	ListenerAction,
	ListenerCondition,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface PaymentApiProps extends GuStackProps {
	domainName: string;
	scaling: GuAsgCapacity;
}

export class PaymentApi extends GuStack {
	constructor(scope: App, id: string, props: PaymentApiProps) {
		super(scope, id, props);

		const emailSqsCodeArn = new GuStringParameter(
			this,
			'EmailSqsQueueCodeArn',
			{
				description:
					'For the PROD stack you still need to supply this, because PROD instances need access to both PROD and CODE email queues.',
			},
		);

		const emailSqsProdArn = new GuStringParameter(
			this,
			'EmailSqsQueueProdArn',
			{
				description:
					"For the CODE stack you can leave this empty since it won't be used.  For the PROD stack you need to set it.",
			},
		);

		const ophanRole = new GuStringParameter(this, 'OphanRole', {
			description: 'ARN of the Ophan cross-account role',
		});

		const kinesisStreamArn = new GuStringParameter(this, 'KinesisStreamArn', {
			description: 'ARN of the kinesis stream to write events to',
		});

		const contributionsStoreSqsQueueCodeArn = new GuStringParameter(
			this,
			'ContributionsStoreSqsQueueCodeArn',
			{
				description:
					'For the PROD stack you still need to supply this, because PROD instances need access to both PROD and CODE contribution store queues.',
			},
		);

		const contributionsStoreSqsQueueProdArn = new GuStringParameter(
			this,
			'ContributionsStoreSqsQueueProdArn',
			{
				description:
					"For the CODE stack you can leave this empty since it won't be used.  For the PROD stack you need to set it.",
			},
		);

		const sqsKmsArn = new GuStringParameter(this, 'SqsKmsArn', {
			description: 'ARN of the KMS key for encrypting SQS data',
		});

		// TODO: Should these remain as cloudformation parameters?
		const projectName = 'payment-api';
		const projectVersion = '0.1';

		const app = 'payment-api';
		const userData = UserData.forLinux();
		userData.addCommands(`#!/bin/bash -ev
    mkdir /etc/gu

    echo ${this.stage} > /etc/gu/stage

    aws --region ${this.region} s3 cp s3://membership-dist/${this.stack}/${this.stage}/${app}/${projectName}_${projectVersion}_all.deb /tmp
    dpkg -i /tmp/${projectName}_${projectVersion}_all.deb
    /opt/cloudwatch-logs/configure-logs application ${this.stack} ${this.stage} ${app} /var/log/${app}/application.log`);

		const playApp = new GuPlayApp(this, {
			app: 'payment-api',
			access: { scope: AccessScope.PUBLIC },
			certificateProps: {
				domainName: props.domainName,
				hostedZoneId: 'Z1E4V12LQGXFEC',
			},
			instanceMetricGranularity: '5Minute',
			monitoringConfiguration: { noMonitoring: true },
			instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
			scaling: props.scaling,
			userData,
			withAccessLogging: false,
			roleConfiguration: {
				additionalPolicies: [
					new GuAllowPolicy(this, 'SupporterProductDataDynamo', {
						actions: [
							'dynamodb:GetItem',
							'dynamodb:Scan',
							'dynamodb:UpdateItem',
							'dynamodb:DeleteItem',
							'dynamodb:Query',
							'dynamodb:DescribeTable',
						],
						resources:
							this.stage === 'PROD'
								? [
										'arn:aws:dynamodb:*:*:table/SupporterProductData-PROD',
										'arn:aws:dynamodb:*:*:table/SupporterProductData-CODE',
								  ]
								: ['arn:aws:dynamodb:*:*:table/SupporterProductData-CODE'],
					}),

					new GuAllowPolicy(this, 'CloudwatchLogs', {
						actions: [
							'logs:CreateLogGroup',
							'logs:CreateLogStream',
							'logs:PutLogEvents',
						],
						// TODO: Should we use a more specific resource here?
						resources: ['arn:aws:logs:*:*:*'],
					}),
					new GuAllowPolicy(this, 'SSMConfigParams', {
						actions: ['ssm:GetParametersByPath'],
						resources: [
							`arn:aws:ssm:${this.region}:${this.account}:parameter/${app}/*`,
						],
					}),
					new GuAllowPolicy(this, 'EmailSqsMessages', {
						actions: ['sqs:GetQueueUrl', 'sqs:SendMessage'],
						resources:
							this.stage === 'PROD'
								? [emailSqsCodeArn.valueAsString, emailSqsProdArn.valueAsString]
								: [emailSqsCodeArn.valueAsString],
					}),
					new GuAllowPolicy(this, 'SoftOptInsSqsMessages', {
						actions: ['sqs:GetQueueUrl', 'sqs:SendMessage'],
						resources:
							this.stage === 'PROD'
								? [
										`arn:aws:sqs:${this.region}:${this.account}:soft-opt-in-consent-setter-queue-PROD`,
										`arn:aws:sqs:${this.region}:${this.account}:soft-opt-in-consent-setter-queue-CODE`,
								  ]
								: [
										`arn:aws:sqs:${this.region}:${this.account}:soft-opt-in-consent-setter-queue-CODE`,
								  ],
					}),
					new GuPutCloudwatchMetricsPolicy(this),
					new GuAllowPolicy(this, 'AssumeOphanRole', {
						actions: ['sts:AssumeRole'],
						resources: [ophanRole.valueAsString],
					}),
					new GuAllowPolicy(this, 'KinesisPut', {
						actions: ['kinesis:*'],
						resources: [kinesisStreamArn.valueAsString],
					}),
					new GuAllowPolicy(this, 'EventBusPut', {
						actions: ['events:PutEvents'],
						resources:
							this.stage === 'PROD'
								? [
										`arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-CODE`,
										`arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-PROD`,
								  ]
								: [
										`arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-CODE`,
								  ],
					}),
					new GuAllowPolicy(this, 'SQSPut', {
						actions: ['sqs:SendMessage'],
						resources:
							this.stage === 'PROD'
								? [
										contributionsStoreSqsQueueCodeArn.valueAsString,
										contributionsStoreSqsQueueProdArn.valueAsString,
								  ]
								: [contributionsStoreSqsQueueCodeArn.valueAsString],
					}),
					new GuAllowPolicy(this, 'SqsKmsEncryption', {
						actions: ['kms:Encrypt'],
						resources: [sqsKmsArn.valueAsString],
					}),
					new GuGetS3ObjectsPolicy(this, 'SettingsBucket', {
						bucketName: 'support-admin-console',
						paths: this.stage === 'PROD' ? ['*/*'] : ['CODE/*'],
					}),
				],
			},
		});

		// Rule to only allow known http methods
		new ApplicationListenerRule(this, 'AllowKnownMethods', {
			listener: playApp.listener,
			priority: 1,
			conditions: [
				ListenerCondition.httpRequestMethods([
					'GET',
					'POST',
					'OPTIONS',
					'DELETE',
					'HEAD',
				]),
			],
			targetGroups: [playApp.targetGroup],
		});
		// Default rule to block requests which don't match the above rule
		new ApplicationListenerRule(this, 'BlockUnknownMethods', {
			listener: playApp.listener,
			priority: 2,
			conditions: [ListenerCondition.pathPatterns(['*'])], // anything
			action: ListenerAction.fixedResponse(400, {
				contentType: 'application/json',
				messageBody: 'Unsupported http method',
			}),
		});

		// ---- Alarms ---- //

		const noHealthyInstancesDescriptor = 'No healthy instances';
		new GuAlarm(this, 'NoHealthyInstancesAlarm', {
			app,
			alarmName: `[CDK] ${this.stage} ${noHealthyInstancesDescriptor}`,
			alarmDescription: `[CDK] ${app} ${this.stage} ${noHealthyInstancesDescriptor}`,
			actionsEnabled: props.stage === 'PROD',
			threshold: 0.5,
			evaluationPeriods: 2,
			comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
			metric: new Metric({
				metricName: 'HealthyHostCount',
				namespace: 'AWS/ApplicationELB',
				dimensionsMap: {
					LoadBalancer: playApp.loadBalancer.loadBalancerFullName,
					TargetGroup: playApp.targetGroup.targetGroupFullName,
				},
				statistic: 'Average',
				period: Duration.seconds(60),
			}),
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		const high5XXRateDescriptor = 'High 5XX rate';
		new GuAlarm(this, 'High5XXRateAlarm', {
			app,
			alarmName: `[CDK] ${this.stage} ${high5XXRateDescriptor}`,
			alarmDescription: `[CDK]  ${app} ${this.stage} ${high5XXRateDescriptor}`,
			actionsEnabled: props.stage === 'PROD',
			threshold: 3,
			evaluationPeriods: 2,
			comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
			metric: new Metric({
				metricName: 'HTTPCode_Target_5XX_Count',
				namespace: 'AWS/ApplicationELB',
				dimensionsMap: {
					LoadBalancer: playApp.loadBalancer.loadBalancerFullName,
					TargetGroup: playApp.targetGroup.targetGroupFullName,
				},
				statistic: 'Sum',
				period: Duration.seconds(60),
			}),
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		const paypalDescriptor =
			'No successful paypal payments via payment-api for';
		const paypalMetricDuration = Duration.minutes(5);
		const paypalEvaluationPeriods = 18; // The number of 5 minute periods in 90 minutes
		const paypalAlarmPeriod = Duration.minutes(
			paypalMetricDuration.toMinutes() * paypalEvaluationPeriods,
		);
		new GuAlarm(this, 'NoPaypalPaymentsInPeriodAlarm', {
			app,
			alarmName: `[CDK] ${this.stage} ${paypalDescriptor} period`,
			alarmDescription: `[CDK] ${app} ${
				this.stage
			} ${paypalDescriptor} ${paypalAlarmPeriod.toHumanString()}`,
			actionsEnabled: props.stage === 'PROD',
			okAction: true,
			threshold: 0,
			evaluationPeriods: paypalEvaluationPeriods,
			comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
			metric: new Metric({
				metricName: 'payment-success',
				namespace: `support-payment-api-${this.stage}`,
				dimensionsMap: {
					'payment-provider': 'Paypal',
				},
				statistic: 'Sum',
				period: paypalMetricDuration,
			}),
			treatMissingData: TreatMissingData.BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		const stripePaymentsDescriptor =
			'No successful stripe payments via payment-api for';
		const stripePaymentsMetricDuration = Duration.minutes(5);
		const stripePaymentsEvaluationPeriods = 12; // The number of 5 minute periods in 1 hour
		const stripePaymentsAlarmPeriod = Duration.minutes(
			stripePaymentsMetricDuration.toMinutes() *
				stripePaymentsEvaluationPeriods,
		);
		new GuAlarm(this, 'NoStripePaymentsInOneHourAlarm', {
			app,
			alarmName: `[CDK] ${this.stage} ${stripePaymentsDescriptor} period`,
			alarmDescription: `[CDK] ${app} ${
				this.stage
			} ${stripePaymentsDescriptor} ${stripePaymentsAlarmPeriod.toHumanString()}`,
			actionsEnabled: props.stage === 'PROD',
			okAction: true,
			threshold: 0,
			evaluationPeriods: stripePaymentsEvaluationPeriods,
			comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
			metric: new Metric({
				metricName: 'payment-success',
				namespace: `support-payment-api-${this.stage}`,
				dimensionsMap: {
					'payment-provider': 'Stripe',
				},
				statistic: 'Sum',
				period: stripePaymentsMetricDuration,
			}),
			treatMissingData: TreatMissingData.BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		const stripeExpressAlarmDescriptor = `No successful stripe express payments via payment-api for`;
		const stripeExpressMetricDuration = Duration.minutes(5);
		const stripeExpressEvaluationPeriods = 36; // The number of 5 minute periods in 3 hours
		const stripeExpressAlarmPeriod = Duration.minutes(
			stripeExpressMetricDuration.toMinutes() * stripeExpressEvaluationPeriods,
		);
		const [applePaySuccessMetric, paymentRequestButtonSuccessMetric] = [
			'StripeApplePay',
			'StripePaymentRequestButton',
		].map(
			(paymentProvider) =>
				new Metric({
					metricName: 'payment-success',
					namespace: `support-payment-api-${this.stage}`,
					dimensionsMap: {
						'payment-provider': paymentProvider,
					},
					statistic: 'Sum',
					period: stripeExpressMetricDuration,
				}),
		);
		const combinedApplePayAndPaymentRequestButtonSuccessMetric =
			new MathExpression({
				expression: 'SUM(METRICS())',
				period: stripeExpressMetricDuration,
				usingMetrics: {
					m1: applePaySuccessMetric,
					m2: paymentRequestButtonSuccessMetric,
				},
			});
		new GuAlarm(this, 'NoStripeExpressPaymentsInOneHourAlarm', {
			app,
			alarmName: `[CDK] ${this.stage} ${stripeExpressAlarmDescriptor} period`,
			alarmDescription: `[CDK] ${app} ${
				this.stage
			} ${stripeExpressAlarmDescriptor} ${stripeExpressAlarmPeriod.toHumanString()}`,
			actionsEnabled: props.stage === 'PROD',
			okAction: true,
			threshold: 0,
			evaluationPeriods: stripeExpressEvaluationPeriods,
			comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
			metric: combinedApplePayAndPaymentRequestButtonSuccessMetric,
			treatMissingData: TreatMissingData.BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		const stripeRateLimitingDescriptor =
			'One or more requests have exceeded the rate limit for Stripe one-off contribution via the payment-api for';
		const stripeRateLimitingMetricDuration = Duration.minutes(15);
		new GuAlarm(this, 'StripeRateLimitingAlarm', {
			app,
			alarmName: `[CDK] ${this.stage} ${stripeRateLimitingDescriptor} period`,
			alarmDescription: `[CDK] ${app} ${
				this.stage
			} ${stripeRateLimitingDescriptor} ${stripeRateLimitingMetricDuration.toHumanString()}`,
			actionsEnabled: props.stage === 'PROD',
			threshold: 0,
			evaluationPeriods: 1,
			comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
			metric: new Metric({
				metricName: 'stripe-rate-limit-exceeded',
				namespace: `support-payment-api-${this.stage}`,
				dimensionsMap: {
					'payment-provider': 'Stripe',
				},
				statistic: 'Sum',
				period: stripeRateLimitingMetricDuration,
			}),
			treatMissingData: TreatMissingData.NOT_BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		new GuAlarm(this, 'PaypalPaymentError', {
			app,
			alarmName: `[CDK] ${app} ${this.stage} Paypal payment error for one-off contribution via the payment-api`,
			actionsEnabled: props.stage === 'PROD',
			threshold: 0,
			evaluationPeriods: 1,
			comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
			metric: new Metric({
				metricName: 'payment-error',
				namespace: `support-payment-api-${this.stage}`,
				dimensionsMap: {
					'payment-provider': 'Paypal',
				},
				statistic: 'Sum',
				period: Duration.seconds(60),
			}),
			treatMissingData: TreatMissingData.NOT_BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		new GuAlarm(this, 'StripePaymentError', {
			app,
			alarmName: `[CDK] ${app} ${this.stage} Stripe payment error for one-off contribution via the payment-api`,
			actionsEnabled: props.stage === 'PROD',
			threshold: 0,
			evaluationPeriods: 1,
			comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
			metric: new Metric({
				metricName: 'payment-error',
				namespace: `support-payment-api-${this.stage}`,
				dimensionsMap: {
					'payment-provider': 'Stripe',
				},
				statistic: 'Sum',
				period: Duration.seconds(60),
			}),
			treatMissingData: TreatMissingData.NOT_BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});

		new GuAlarm(this, 'PostPaymentError', {
			app,
			alarmName: `[CDK] ${app} ${this.stage} Failed post-payment task for one-off contribution via the payment-api`,
			actionsEnabled: props.stage === 'PROD',
			threshold: 0,
			evaluationPeriods: 1,
			comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
			metric: new Metric({
				metricName: 'payment-error',
				namespace: 'post-payment-tasks-error',
				statistic: 'Sum',
				period: Duration.seconds(60),
			}),
			treatMissingData: TreatMissingData.NOT_BREACHING,
			snsTopicName: `alarms-handler-topic-${this.stage}`,
		});
	}
}
