import type { Dimension } from '@aws-sdk/client-cloudwatch';
import { putMetric } from '@modules/aws/cloudwatch';
import { buildFromState } from '../acquisitionData/acquisitionDataRowBuilder';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import type { Stage } from '../model/stage';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { AcquisitionEventBusService } from '../services/acquisitionEventBusService';
import { ServiceProvider } from '../services/config';

const stage = stageFromEnvironment();
const acquisitionEventBusServiceServiceProvider = new ServiceProvider(
	stage,
	(stage) => {
		return Promise.resolve(new AcquisitionEventBusService(stage));
	},
);
async function sendPaymentSuccessMetric(
	stage: Stage,
	state: SendAcquisitionEventState,
) {
	const metricNamespace = 'support-frontend';
	const qualifiedStage =
		stage + (state.sendThankYouEmailState.user.isTestUser ? '-TEST' : '');
	const dimensions: Dimension[] = [
		{ Name: 'PaymentProvider', Value: state.analyticsInfo.paymentProvider },
		{
			Name: 'ProductType',
			Value: state.sendThankYouEmailState.product.productType,
		},
		{ Name: 'Stage', Value: qualifiedStage },
	];
	await putMetric('PaymentSuccess', stage, dimensions, metricNamespace);
}

export const handler = async (
	state: WrappedState<SendAcquisitionEventState>,
) => {
	console.info(`Input is ${JSON.stringify(state)}`);

	await sendPaymentSuccessMetric(stage, state.state);

	const acquisitionEvent = buildFromState(state.state);

	const service =
		await acquisitionEventBusServiceServiceProvider.getServiceForUser(
			state.state.sendThankYouEmailState.user.isTestUser,
		);
	await service.sendEvent(acquisitionEvent);
};
