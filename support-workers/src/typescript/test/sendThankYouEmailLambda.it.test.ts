/**
 * @group integration
 */

import { handler } from '../lambdas/sendThankYouEmailLambda';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import { sendAcquisitionEventStateSchema } from '../model/sendAcquisitionEventState';
import type { WrappedState } from '../model/stateSchemas';
import { wrapperSchemaForState } from '../model/stateSchemas';
import contributionJson from './fixtures/sendThankYouEmail/contributionState.json';
import digitalSubscriptionJson from './fixtures/sendThankYouEmail/digitalSubscriptionState.json';
import guardianAdLiteJson from './fixtures/sendThankYouEmail/guardianAdLiteState.json';
import guardianWeeklyJson from './fixtures/sendThankYouEmail/guardianWeeklyState.json';
import supporterPlusJson from './fixtures/sendThankYouEmail/supporterPlusState.json';
import tierThreeJson from './fixtures/sendThankYouEmail/tierThreeState.json';

describe('sendThankYouEmailLambda integration', () => {
	// If you want to receive the test emails, change this to your email address
	const emailToSendTestEmailsTo = `integration-test@thegulocal.com`;

	const sendEmail = (state: WrappedState<SendAcquisitionEventState>) => {
		state.state.sendThankYouEmailState.user.primaryEmailAddress =
			emailToSendTestEmailsTo;
		return handler(state);
	};

	test('we can send a supporter plus email successfully', async () => {
		await sendEmail(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				supporterPlusJson,
			),
		);
	});
	test('we can send a contribution email successfully', async () => {
		await sendEmail(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				contributionJson,
			),
		);
	});
	test('we can send a digital subscription email successfully', async () => {
		await sendEmail(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				digitalSubscriptionJson,
			),
		);
	});
	test('we can send a tier three email successfully', async () => {
		await sendEmail(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				tierThreeJson,
			),
		);
	});
	test('we can send a guardian weekly email successfully', async () => {
		await sendEmail(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				guardianWeeklyJson,
			),
		);
	});
	test('we can send a Guardian Ad-Lite email successfully', async () => {
		await sendEmail(
			wrapperSchemaForState(sendAcquisitionEventStateSchema).parse(
				guardianAdLiteJson,
			),
		);
	});
});
