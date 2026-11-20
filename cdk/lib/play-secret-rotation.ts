import { GuScheduledLambda } from '@guardian/cdk';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import type { App } from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class PlaySecretRotation extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const app = 'play-secret-rotation';
		const playSecretParameterName = `/${this.stack}/frontend/${this.stage}/play.http.secret.key`;

		const lambda = new GuScheduledLambda(this, 'PlaySecretRotationLambda', {
			app,
			functionName: `${app}-${this.stage}`,
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
			monitoringConfiguration: { noMonitoring: true },
			timeout: Duration.seconds(30),
			reservedConcurrentExecutions: 1,
			retryAttempts: 0,
		});

		lambda.addToRolePolicy(
			new PolicyStatement({
				actions: ['ssm:GetParameter', 'ssm:PutParameter'],
				resources: [
					`arn:aws:ssm:${this.region}:${this.account}:parameter${playSecretParameterName}`,
				],
			}),
		);
	}
}
