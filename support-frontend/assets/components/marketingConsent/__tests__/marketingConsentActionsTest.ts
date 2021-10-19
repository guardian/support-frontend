// ----- Imports ----- //
import { marketingConsentActionsFor } from '../marketingConsentActions';
// ----- Tests ----- //
describe('Marketing Consent actions', () => {
	const scope: string = 'ExampleScope';
	const actions = marketingConsentActionsFor(scope);
	it('should create an action to set an API error', () => {
		const expectedAPIErrorTrue = {
			type: 'SET_API_ERROR',
			error: true,
			scope,
		};
		const expectedAPIErrorFalse = {
			type: 'SET_API_ERROR',
			error: false,
			scope,
		};
		expect(actions.setAPIError(true)).toEqual(expectedAPIErrorTrue);
		expect(actions.setAPIError(false)).toEqual(expectedAPIErrorFalse);
	});
	it('should create an action to set the confirmation marketing consent', () => {
		const confirmOptIn = true;
		const expectedAction = {
			type: 'SET_CONFIRM_MARKETING_CONSENT',
			confirmOptIn,
			scope,
		};
		expect(actions.setConfirmMarketingConsent(confirmOptIn)).toEqual(
			expectedAction,
		);
	});
});
