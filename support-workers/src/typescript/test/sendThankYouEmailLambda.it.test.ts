/**
 * @group integration
 */

import { handler } from '../lambdas/sendThankYouEmailLambda';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import type { WrappedState } from '../model/stateSchemas';
import contributionJson from './fixtures/sendThankYouEmail/contributionState.json';
import digitalSubscriptionJson from './fixtures/sendThankYouEmail/digitalSubscriptionState.json';
import supporterPlusJson from './fixtures/sendThankYouEmail/supporterPlusState.json';
import tierThreeJson from './fixtures/sendThankYouEmail/tierThreeState.json';

describe('sendThankYouEmailLambda integration', () => {
	// If you want to receive the test emails, change this to your email address
	const emailToSendTestEmailsTo = 'rupert.bates+smoke-test@theguardian.com';

	const sendEmail = (state: WrappedState<SendAcquisitionEventState>) => {
		state.state.sendThankYouEmailState.user.primaryEmailAddress =
			emailToSendTestEmailsTo;
		return handler(state);
	};

	test('we can send a supporter plus email successfully', async () => {
		await sendEmail(
			supporterPlusJson as WrappedState<SendAcquisitionEventState>,
		);
	});
	test('we can send a contribution email successfully', async () => {
		await sendEmail(
			contributionJson as WrappedState<SendAcquisitionEventState>,
		);
	});
	test('we can send a digital subscription email successfully', async () => {
		await sendEmail(
			digitalSubscriptionJson as WrappedState<SendAcquisitionEventState>,
		);
	});
	test('we can send a tier three email successfully', async () => {
		await sendEmail(tierThreeJson as WrappedState<SendAcquisitionEventState>);
	});
});
