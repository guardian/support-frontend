/**
 * @group integration
 */
import { handler } from '../lambdas/sendAcquisitionEventLambda';
import { sendAcquisitionEventStateSchema } from '../model/sendAcquisitionEventState';
import { wrapperSchemaForState } from '../model/stateSchemas';
import contributionJson from './fixtures/sendThankYouEmail/contributionState.json';
import digitalSubscriptionJson from './fixtures/sendThankYouEmail/digitalSubscriptionState.json';
import guardianAdLiteJson from './fixtures/sendThankYouEmail/guardianAdLiteState.json';
import guardianWeeklyJson from './fixtures/sendThankYouEmail/guardianWeeklyState.json';
import supporterPlusJson from './fixtures/sendThankYouEmail/supporterPlusState.json';
import tierThreeJson from './fixtures/sendThankYouEmail/tierThreeState.json';

describe('sendAcquisitionEventLambda integration', () => {
	test('we can send an contribution acquisition event successfully', async () => {
		const result = await handler(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				contributionJson,
			),
		);
		expect(result.success).toBe(true);
	});
	test('we can send a digital subscription acquisition event successfully', async () => {
		const result = await handler(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				digitalSubscriptionJson,
			),
		);
		expect(result.success).toBe(true);
	});
	test('we can send a guardian ad lite acquisition event successfully', async () => {
		const result = await handler(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				guardianAdLiteJson,
			),
		);
		expect(result.success).toBe(true);
	});
	test('we can send a guardian weekly acquisition event successfully', async () => {
		const result = await handler(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				guardianWeeklyJson,
			),
		);
		expect(result.success).toBe(true);
	});
	test('we can send a supporter plus acquisition event successfully', async () => {
		const result = await handler(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				supporterPlusJson,
			),
		);
		expect(result.success).toBe(true);
	});
	test('we can send a tier three acquisition event successfully', async () => {
		const result = await handler(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				tierThreeJson,
			),
		);
		expect(result.success).toBe(true);
	});
});
