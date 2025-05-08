import type { ProductConsent } from '../components/SoftOptInCheckoutConsent';
import getConsentValue from './getConsentValue';

describe('getConsentValue', () => {
	const consentKey: ProductConsent = 'similarProductsConsent';

	it('returns true when consent is explicitly "true"', () => {
		const formData = new FormData();
		formData.set(consentKey, 'true');

		const result = getConsentValue(formData, consentKey);
		expect(result).toBe(true);
	});

	it('returns false when consent is explicitly "false"', () => {
		const formData = new FormData();
		formData.set(consentKey, 'false');

		const result = getConsentValue(formData, consentKey);
		expect(result).toBe(false);
	});

	it('returns undefined when the key is not present', () => {
		const formData = new FormData();

		const result = getConsentValue(formData, consentKey);
		expect(result).toBeUndefined();
	});
});
