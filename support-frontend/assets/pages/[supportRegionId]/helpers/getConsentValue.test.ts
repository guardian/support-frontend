import { CONSENT_ID } from '../components/SimilarProductsConsent';
import getConsentValue from './getConsentValue';

describe('getConsentValue', () => {
	it('returns true when consent is explicitly "true"', () => {
		const formData = new FormData();
		formData.set(CONSENT_ID, 'true');

		const result = getConsentValue(formData, CONSENT_ID);
		expect(result).toBe(true);
	});

	it('returns false when consent is explicitly "false"', () => {
		const formData = new FormData();
		formData.set(CONSENT_ID, 'false');

		const result = getConsentValue(formData, CONSENT_ID);
		expect(result).toBe(false);
	});

	it('returns undefined when the key is not present', () => {
		const formData = new FormData();

		const result = getConsentValue(formData, CONSENT_ID);
		expect(result).toBeUndefined();
	});
});
