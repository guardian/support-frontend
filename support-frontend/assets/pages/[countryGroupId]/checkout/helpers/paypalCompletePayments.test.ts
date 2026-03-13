import fetchMock from '@fetch-mock/jest';
import {
	createSetupToken,
	exchangeSetupTokenForPaymentToken,
} from './paypalCompletePayments';

beforeAll(() => {
	fetchMock.mockGlobal();
});

afterAll(() => {
	fetchMock.unmockGlobal();
});

beforeEach(() => {
	fetchMock.removeRoutes();
});

describe('paypalCompletePayments', () => {
	describe('createSetupToken', () => {
		it('returns the token from the response', async () => {
			const csrfToken = 'csrf-token';
			fetchMock.post('/paypal-complete-payments/setup-token', {
				body: { token: 'setup-token' },
				headers: { 'Content-Type': 'application/json' },
			});

			const token = await createSetupToken(csrfToken);

			expect(token).toEqual('setup-token');
		});

		it('throws an error for a non OK response', async () => {
			const csrfToken = 'csrf-token';
			fetchMock.post('/paypal-complete-payments/setup-token', {
				status: 500,
			});

			await expect(createSetupToken(csrfToken)).rejects.toThrow(
				'Create setup token request returned a non OK response',
			);
		});

		it('throws an error for an invalid response', async () => {
			const csrfToken = 'csrf-token';
			fetchMock.post('/paypal-complete-payments/setup-token', {
				body: { bad: 'format' },
				headers: { 'Content-Type': 'application/json' },
			});

			await expect(createSetupToken(csrfToken)).rejects.toThrow(
				'Create setup token response was invalid',
			);
		});
	});

	describe('exchangeSetupTokenForPaymentToken', () => {
		it('returns the payment token and email from the response', async () => {
			const csrfToken = 'csrf-token';
			const setupToken = 'setup-token';
			fetchMock.post('/paypal-complete-payments/payment-token', {
				body: { token: 'payment-token', email: 'example@theguardian.com' },
				headers: { 'Content-Type': 'application/json' },
			});

			const response = await exchangeSetupTokenForPaymentToken(
				csrfToken,
				setupToken,
			);

			expect(response).toEqual({
				token: 'payment-token',
				email: 'example@theguardian.com',
			});
		});

		it('throws an error for a non OK response', async () => {
			const csrfToken = 'csrf-token';
			const setupToken = 'setup-token';
			fetchMock.post('/paypal-complete-payments/payment-token', {
				status: 500,
			});

			await expect(
				exchangeSetupTokenForPaymentToken(csrfToken, setupToken),
			).rejects.toThrow(
				'Create payment token request returned a non OK response',
			);
		});

		it('throws an error for an invalid response', async () => {
			const csrfToken = 'csrf-token';
			const setupToken = 'setup-token';
			fetchMock.post('/paypal-complete-payments/payment-token', {
				body: { bad: 'format' },
				headers: { 'Content-Type': 'application/json' },
			});

			await expect(
				exchangeSetupTokenForPaymentToken(csrfToken, setupToken),
			).rejects.toThrow('Create payment token response was invalid');
		});
	});
});
