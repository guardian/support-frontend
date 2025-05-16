function getConsentValue(
	formData: FormData,
	productConsent: string,
): boolean | undefined {
	const consentValue = formData.get(productConsent);

	if (!consentValue) {
		return;
	}

	return consentValue === 'true';
}

export default getConsentValue;
