import { getZuoraPaymentMethod } from '../lambdas/createZuoraSubscriptionTSLambda';
import type { PaymentMethod } from '../model/paymentMethod';

describe('getZuoraPaymentMethod', () => {
	test('should map CreditCardReferenceTransaction correctly', () => {
		const paymentMethod = {
			Type: 'CreditCardReferenceTransaction',
			TokenId: 'tok_123',
			SecondTokenId: 'tok_456',
			CreditCardNumber: '4242',
			CreditCardType: 'Visa',
			CreditCardExpirationMonth: 2,
			CreditCardExpirationYear: 2026,
		} as PaymentMethod;
		expect(getZuoraPaymentMethod(paymentMethod)).toEqual({
			type: 'CreditCardReferenceTransaction',
			tokenId: 'tok_123',
			secondTokenId: 'tok_456',
			cardNumber: '4242',
			cardType: 'Visa',
			expirationMonth: 2,
			expirationYear: 2026,
		});
	});

	test('should map PayPal correctly', () => {
		const paymentMethod = {
			Type: 'PayPal',
			PaypalBaid: 'baid_789',
			PaypalEmail: 'user@example.com',
		} as PaymentMethod;
		expect(getZuoraPaymentMethod(paymentMethod)).toEqual({
			type: 'PayPalCP',
			BAID: 'baid_789',
			email: 'user@example.com',
		});
	});

	test('should map BankTransfer correctly', () => {
		const paymentMethod = {
			Type: 'BankTransfer',
			BankTransferAccountName: 'John Doe',
			BankTransferAccountNumber: '12345678',
			BankCode: '12-34-56',
		} as PaymentMethod;
		expect(getZuoraPaymentMethod(paymentMethod)).toEqual({
			type: 'Bacs',
			accountHolderInfo: {
				accountHolderName: 'John Doe',
			},
			accountNumber: '12345678',
			bankCode: '12-34-56',
		});
	});
});
