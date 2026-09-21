import type { PaymentMethod } from '@stripe/stripe-js';
import { logException } from 'helpers/utilities/logger';
import { getStripePaymentMethod } from './oneOffContributions';

jest.mock('helpers/utilities/logger', () => ({
	logException: jest.fn(),
}));

const createPaymentMethod = ({
	type = 'card',
	walletType,
	paypal,
}: {
	type?: string;
	walletType?: string;
	paypal?: object;
}): PaymentMethod =>
	({
		type,
		card: walletType ? { wallet: { type: walletType } } : undefined,
		paypal,
	} as PaymentMethod);

describe('getStripePaymentMethod', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('maps PayPal PaymentMethods to StripePaypal', () => {
		expect(
			getStripePaymentMethod(
				createPaymentMethod({ type: 'paypal', paypal: {} }),
			),
		).toBe('StripePaypal');
	});

	it('maps PayPal PaymentMethods without a paypal field to StripePaypal and logs the inconsistency', () => {
		expect(
			getStripePaymentMethod(createPaymentMethod({ type: 'paypal' })),
		).toBe('StripePaypal');
		expect(logException).toHaveBeenCalledWith(
			'Stripe paymentMethod type is paypal but no paypal field exists',
		);
	});

	it('maps Apple Pay card wallets to StripeApplePay', () => {
		expect(
			getStripePaymentMethod(
				createPaymentMethod({ type: 'card', walletType: 'apple_pay' }),
			),
		).toBe('StripeApplePay');
	});

	it.each(['google_pay', 'link', 'samsung_pay', 'unknown'])(
		'maps %s card wallets to StripePaymentRequestButton',
		(walletType) => {
			expect(getStripePaymentMethod(createPaymentMethod({ walletType }))).toBe(
				'StripePaymentRequestButton',
			);
		},
	);

	it.each([undefined, null])(
		'maps a card with wallet value %s to StripeCheckout',
		(wallet) => {
			expect(
				getStripePaymentMethod({
					type: 'card',
					card: { wallet },
				} as unknown as PaymentMethod),
			).toBe('StripeCheckout');
		},
	);

	it('maps a PayPal PaymentMethod independently of the UI flow that produced it', () => {
		expect(
			getStripePaymentMethod(
				createPaymentMethod({ type: 'PaYpAl', paypal: {} }),
			),
		).toBe('StripePaypal');
	});

	it('falls back to StripeCheckout and logs unsupported non-card types', () => {
		expect(
			getStripePaymentMethod(createPaymentMethod({ type: 'klarna' })),
		).toBe('StripeCheckout');
		expect(logException).toHaveBeenCalledWith(
			'Unexpected Stripe paymentMethod type: klarna',
		);
	});
});
