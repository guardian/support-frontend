import type {
	Dimension,
	PutMetricDataCommandInput,
} from '@aws-sdk/client-cloudwatch';
import {
	CloudWatchClient,
	PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import { isTest, stageFromEnvironment } from '../utils/stage';

const namespace = 'support-backend';

type MetricName = 'GetDeliveryAgentsFailure' | 'GetDeliveryAgentsSuccess';

export async function putMetric(metricName: MetricName): Promise<void> {
	if (isTest()) {
		return;
	}

	const cloudwatch = new CloudWatchClient({
		region: process.env.AWS_REGION ?? 'eu-west-1',
	});

	const dimensions: Dimension[] = [
		{
			Name: 'Stage',
			Value: stageFromEnvironment(),
		},
	];

	const params: PutMetricDataCommandInput = {
		Namespace: namespace,
		MetricData: [
			{
				MetricName: metricName,
				Value: 1,
				Unit: 'Count',
				Dimensions: dimensions,
			},
		],
	};

	const command = new PutMetricDataCommand(params);

	await cloudwatch.send(command);
}
