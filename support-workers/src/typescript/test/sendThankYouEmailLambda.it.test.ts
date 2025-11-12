/**
 * @group integration
 */

import { handler } from '../lambdas/sendThankYouEmailLambda';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import type { WrappedState } from '../model/stateSchemas';
import contributionJson from './fixtures/sendThankYouEmail/contributionState.json';
import digitalSubscriptionJson from './fixtures/sendThankYouEmail/digitalSubscriptionState.json';
import supporterPlusJson from './fixtures/sendThankYouEmail/supporterPlusState.json';

describe('sendThankYouEmailLambda integration', () => {
	test('we can send a supporter plus email successfully', async () => {
		await handler(supporterPlusJson as WrappedState<SendAcquisitionEventState>);
	});
	test('we can send a contribution email successfully', async () => {
		await handler(contributionJson as WrappedState<SendAcquisitionEventState>);
	});
	test('we can send a digital subscription email successfully', async () => {
		await handler(
			digitalSubscriptionJson as WrappedState<SendAcquisitionEventState>,
		);
	});
});
