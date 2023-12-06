import { signal } from '@preact/signals';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

export const currencySignal = signal<IsoCurrency>('GBP');

export function setCurrencyFromUrl() {
	const region = window.location.pathname.split('/')[1];

	switch (region) {
		case 'uk':
			currencySignal.value = 'GBP';
			break;
		case 'us':
			currencySignal.value = 'USD';
			break;
		case 'au':
			currencySignal.value = 'AUD';
			break;
		case 'eu':
			currencySignal.value = 'EUR';
			break;
		case 'nz':
			currencySignal.value = 'NZD';
			break;
		case 'ca':
			currencySignal.value = 'CAD';
			break;
		case 'int':
			currencySignal.value = 'USD';
			break;
	}
}
