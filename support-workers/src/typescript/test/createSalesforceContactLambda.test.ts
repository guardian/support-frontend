import { createNextState } from '../lambdas/createSalesforceContactLambda';
import { createSalesforceContactStateSchema } from '../model/stateSchemas';
import type { SalesforceContactRecord } from '../services/salesforce';
import createSalesforceContactContribution from './fixtures/createSalesforceContact/contributionMonthlyUSD.json';

const contactRecord: SalesforceContactRecord = {
	Id: 'contact-1',
	AccountId: 'account-1',
};

const consentSnapshots = [
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

describe('CreateSalesforceContact state transition', () => {
	test.each(consentSnapshots)(
		'preserves %s CMP snapshot and similar-products consent',
		(_framework, cmpConsentSnapshot) => {
			const state = createSalesforceContactStateSchema.parse({
				...createSalesforceContactContribution,
				similarProductsConsent: true,
				cmpConsentSnapshot,
			});

			const nextState = createNextState(state, contactRecord);

			expect(nextState.cmpConsentSnapshot).toEqual(cmpConsentSnapshot);
			expect(nextState.similarProductsConsent).toBe(true);
			if (nextState.productSpecificState.productType === 'Contribution') {
				expect(nextState.productSpecificState.similarProductsConsent).toBe(
					true,
				);
			}
		},
	);

	test.each([
		['missing', {}],
		['null', { cmpConsentSnapshot: null }],
	] as const)('keeps %s consent unknown', (_consentState, consentFields) => {
		const state = createSalesforceContactStateSchema.parse({
			...createSalesforceContactContribution,
			similarProductsConsent: true,
			...consentFields,
		});

		const nextState = createNextState(state, contactRecord);

		expect(nextState.cmpConsentSnapshot).toBeUndefined();
		expect(nextState.similarProductsConsent).toBe(true);
	});
});
