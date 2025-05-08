import type { ProductConsent } from '../components/SoftOptInCheckoutConsent';

function getConsentValue(
	formData: FormData,
	productConsent: ProductConsent,
): boolean | undefined {
	const consentValue = formData.get(productConsent);

	if (!consentValue) {
		return;
	}

	return consentValue === 'true';
}

export default getConsentValue;
