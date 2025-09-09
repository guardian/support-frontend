import { useState } from 'react';

export function useStateWithCheckoutSession<T>(
	checkoutSessionValue: T | undefined | null,
	defaultValue: T,
): [T, (value: T) => void] {
	const [stateValue, setStateValue] = useState<T>(defaultValue);

	return [checkoutSessionValue ?? stateValue, setStateValue];
}
