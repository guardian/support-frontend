import type { CreateSubscriptionResponse } from '@modules/zuora/createSubscription/createSubscription';
import type { PreviewCreateSubscriptionResponse } from '@modules/zuora/createSubscription/previewCreateSubscription';
import { buildFromState } from '../acquisitionData/acquisitionDataRowBuilder';
import {
	buildOutputState,
	buildSendThankYouEmailState,
} from '../lambdas/createZuoraSubscriptionTSLambda';
import { createZuoraSubscriptionStateSchema } from '../model/createZuoraSubscriptionState';
import type { SendThankYouEmailState } from '../model/sendAcquisitionEventState';
import { wrapperSchemaForState } from '../model/stateSchemas';
import guardianAdLiteJson from './fixtures/createZuoraSubscription/guardianAdLiteInput.json';
import paperJson from './fixtures/createZuoraSubscription/paperInput.json';

const createSubscriptionResponse = {
	orderNumber: '12345',
	accountNumber: '67890',
	subscriptionNumbers: ['sub1', 'sub2'],
	invoiceNumbers: ['inv1', 'inv2'],
	paymentNumber: 'pay1',
	paidAmount: 49.99,
};

const paymentSchedule = {
	payments: [
		{
			date: new Date(),
			amount: 49.99,
			amountWithoutTax: 45,
			taxAmount: 4.99,
		},
	],
};

test('buildThankYouEmailState retains similarProductConsent setting', () => {
	const input = wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
		paperJson,
	);

	const result: SendThankYouEmailState = buildSendThankYouEmailState(
		input.state,
		createSubscriptionResponse,
		paymentSchedule,
		'AS-987654321',
	);
	expect(result.similarProductsConsent).toBe(true);
});

test('buildThankYouEmailState handles missing similarProductConsent setting', () => {
	const input = wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
		guardianAdLiteJson,
	);
	const result: SendThankYouEmailState = buildSendThankYouEmailState(
		input.state,
		createSubscriptionResponse,
		paymentSchedule,
		'AS-987654321',
	);
	expect(result.similarProductsConsent).toBeUndefined();
});

const acquisitionConsentSnapshots = [
	[
		'TCFv2',
		{
			capturedAt: '2026-10-12T10:00:00.000Z',
			consentManagerVersion: '1.0.0',
			framework: 'tcfv2',
			tcfv2: {
				gdprApplies: true,
				consents: { '1': true, '4': false },
				vendorConsents: { '755': true, '999': false },
				eventStatus: 'useractioncomplete',
				addtlConsent: '1~755',
				tcString: 'tcf-string',
			},
		},
	],
	[
		'USNAT',
		{
			capturedAt: '2026-10-12T10:00:00.000Z',
			consentManagerVersion: '1.0.0',
			framework: 'usnat',
			usnat: { doNotSell: true, signalStatus: 'ready' },
		},
	],
	[
		'AUS',
		{
			capturedAt: '2026-10-12T10:00:00.000Z',
			consentManagerVersion: '1.0.0',
			framework: 'aus',
			aus: { personalisedAdvertising: false, signalStatus: 'ready' },
		},
	],
] as const;

test.each(acquisitionConsentSnapshots)(
	'buildOutputState carries %s consent to the acquisition row',
	(_framework, cmpConsentSnapshot) => {
		const { output, acquisitionRow } = buildAcquisitionOutput({
			cmpConsentSnapshot,
		});

		expect(output.state.cmpConsentSnapshot).toEqual(cmpConsentSnapshot);
		expect(output.state.sendThankYouEmailState).not.toHaveProperty(
			'cmpConsentSnapshot',
		);
		expect(output.state.sendThankYouEmailState.similarProductsConsent).toBe(
			true,
		);
		expect(acquisitionRow.cmpConsentSnapshot).toEqual(cmpConsentSnapshot);
		expect(acquisitionRow.similarProductsConsent).toBe(true);
	},
);

test.each([
	['missing', {}],
	['null', { cmpConsentSnapshot: null }],
] as const)(
	'buildOutputState maps %s CMP consent to unknown in the acquisition row',
	(_consentState, consentFields) => {
		const { output, acquisitionRow } = buildAcquisitionOutput(consentFields);

		expect(output.state.cmpConsentSnapshot).toBeUndefined();
		expect(acquisitionRow.cmpConsentSnapshot).toBeNull();
		expect(acquisitionRow.similarProductsConsent).toBe(true);
	},
);

function buildAcquisitionOutput(consentFields: Record<string, unknown> = {}) {
	const input = wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
		{
			...paperJson,
			state: { ...paperJson.state, ...consentFields },
		},
	);
	const previewInvoices = {
		previewResult: {
			invoices: [
				{
					invoiceItems: [
						{
							serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
							amountWithoutTax: 45,
							taxAmount: 4.99,
						},
					],
				},
			],
		},
	} as unknown as PreviewCreateSubscriptionResponse;
	const output = buildOutputState(
		input,
		input.state,
		createSubscriptionResponse as CreateSubscriptionResponse,
		previewInvoices,
	);

	return { output, acquisitionRow: buildFromState(output.state) };
}
