import { GuScheduledLambda } from '@guardian/cdk';
import { GuAlarm } from '@guardian/cdk/lib/constructs/cloudwatch';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import type { App } from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import {
	ComparisonOperator,
	TreatMissingData,
} from 'aws-cdk-lib/aws-cloudwatch';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export class PlaySecretRotation extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const app = 'play-secret-rotation';
		const functionName = `${app}-${this.stage}`;
		const playSecretParameterName = `/${this.stack}/frontend/${this.stage}/play.http.secret.key`;
		const shouldAlarm = this.stage === 'PROD';
		const snsTopicName = `alarms-handler-topic-${this.stage}`;
		const logsUrl = `https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${functionName}`;

		// Receives invocations which fail, or which exceed maxEventAge before running
		const deadLetterQueueName = `dead-letters-${app}-${this.stage}`;
		const deadLetterQueue = new Queue(this, 'DeadLetterQueue', {
			queueName: deadLetterQueueName,
			retentionPeriod: Duration.days(14),
		});

		const lambda = new GuScheduledLambda(this, 'PlaySecretRotationLambda', {
			app,
			functionName,
			fileName: 'index.zip',
			handler: 'index.handler',
			runtime: Runtime.NODEJS_24_X,
			environment: {
				PLAY_SECRET_PARAMETER_NAME: playSecretParameterName,
			},
			rules: [
				{
					schedule: Schedule.cron({ minute: '11', hour: '10' }),
					description:
						'Rotate the support-frontend Play secret daily at 10:11 UTC',
				},
			],
			monitoringConfiguration: shouldAlarm
				? {
						toleratedErrorPercentage: 0,
						snsTopicName,
						alarmName: `The ${this.stage} ${app} lambda has errored`,
						alarmDescription: `Impact - the support-frontend Play secret may not have been rotated. Check the logs for details: ${logsUrl}`,
				  }
				: { noMonitoring: true },
			deadLetterQueue,
			timeout: Duration.seconds(30),
			reservedConcurrentExecutions: 1,
			retryAttempts: 0,
			maxEventAge: Duration.hours(1),
		});

		lambda.addToRolePolicy(
			new PolicyStatement({
				actions: ['ssm:GetParameter', 'ssm:PutParameter'],
				resources: [
					`arn:aws:ssm:${this.region}:${this.account}:parameter${playSecretParameterName}`,
				],
			}),
		);

		new GuAlarm(this, 'DeadLetterQueueAlarm', {
			app,
			alarmName: `The ${this.stage} ${app} lambda invocation has failed`,
			alarmDescription:
				`Impact - the support-frontend Play secret may not have been rotated. ` +
				`There is one or more event in the ${deadLetterQueueName} dead letter queue, ` +
				'meaning the scheduled invocation either errored or expired before it could run. ' +
				'The ErrorCode and ErrorMessage message attributes give the reason. ' +
				'Purge the queue once investigated or the alarm will remain in an alarm state.',
			metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible(),
			threshold: 1,
			evaluationPeriods: 1,
			comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
			treatMissingData: TreatMissingData.NOT_BREACHING,
			snsTopicName,
			actionsEnabled: shouldAlarm,
		});
	}
}
