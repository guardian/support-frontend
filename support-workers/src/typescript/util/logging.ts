export const stringifyWithCmpConsentRedacted = (value: unknown) =>
	JSON.stringify(value, (key, nestedValue: unknown) =>
		key === 'cmpConsentSnapshot' ? '[redacted]' : nestedValue,
	);
