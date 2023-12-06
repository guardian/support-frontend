import { signal } from '@preact/signals';

type Frequency = 'ONE_OFF' | 'MONTHLY' | 'ANNUAL';
type Currency = 'GBP' | 'USD' | 'AUD' | 'EUR' | 'NZD' | 'CAD';

const Newspaper = { kind: 'newspaper', frequencies: ['MONTHLY', 'ANNUAL'] };
const Weekly = { kind: 'weekly', frequencies: ['MONTHLY', 'ANNUAL'] };
const DigitalEdition = {
	kind: 'digitaledition',
	frequencies: ['MONTHLY', 'ANNUAL'],
};
const Plus = { kind: 'plus', frequencies: ['MONTHLY', 'ANNUAL'] };
const RecurringContribution = {
	kind: 'recurring-contribution',
	frequencies: ['MONTHLY', 'ANNUAL'],
};
const OneTimeContribution = {
	kind: 'one-time-contribution',
	frequencies: ['ONE_OFF'],
};

type Recurring =
	| typeof Newspaper
	| typeof Weekly
	| typeof DigitalEdition
	| typeof Plus
	| typeof RecurringContribution;

type OneTimeContribution = typeof OneTimeContribution;

type Product = Recurring | OneTimeContribution;

export type Order = {
	product: Product;
	currency: Currency;
	amount: number;
	frequency: Frequency;
	paymentMethod: 'Stripe' | 'DirectDebit' | 'PayPal' | 'AmazonPay';
	promoCode?: string;
};

type UI = {
	frequency: Frequency;
	amount: number;
	currency: Currency;
};

const recurringPlusThresholds: Record<
	Currency,
	Record<'MONTHLY' | 'ANNUAL', number>
> = {
	GBP: {
		MONTHLY: 10,
		ANNUAL: 95,
	},
	USD: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
	EUR: {
		MONTHLY: 10,
		ANNUAL: 95,
	},
	AUD: {
		MONTHLY: 17,
		ANNUAL: 160,
	},
	NZD: {
		MONTHLY: 17,
		ANNUAL: 160,
	},
	CAD: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
};

// Currency is static to the page
export function mapUIToOrder(ui: UI) {
	let product;
	const { currency, frequency, amount } = ui;

	if (frequency === 'ONE_OFF') {
		product = OneTimeContribution;
	} else {
		const threshold = recurringPlusThresholds[currency][frequency];
		if (amount >= threshold) {
			product = Plus;
		}
	}

	return product;
}

export const s = signal(7);
