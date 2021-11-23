/* eslint-disable eslint-comments/require-description -- This is a mocks file, it is not intended to be good code! */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';

const mockElement = () => ({
	mount: jest.fn(),
	destroy: jest.fn(),
	on: jest.fn(),
	update: jest.fn(),
});

const mockElements = () => {
	const elements: Record<string, any> = {};
	return {
		create: jest.fn((type) => {
			elements[type] = mockElement();
			return elements[type];
		}),
		getElement: jest.fn((type) => elements[type] || mockElement()),
	};
};

const mockStripe = () => ({
	elements: jest.fn(() => mockElements()),
	createToken: jest.fn(),
	createSource: jest.fn(),
	createPaymentMethod: jest.fn(),
	confirmCardPayment: jest.fn(),
	confirmCardSetup: jest.fn().mockResolvedValue({
		setupIntent: {
			payment_method: 'mock',
		},
	}),
	paymentRequest: jest.fn(),
	_registerWrapper: jest.fn(),
});

jest.mock('@stripe/react-stripe-js', () => {
	const stripe = jest.requireActual('@stripe/react-stripe-js');

	function createStripeElementMock(elementType: string) {
		type MockStripeElementProps = {
			id: string;
			onChange: (...args: any[]) => any;
		};
		return function MockStripeElement(props: MockStripeElementProps) {
			function onChange(evt: any) {
				return props.onChange({
					...evt,
					elementType,
					empty: false,
					complete: true,
				});
			}

			return <input type="text" id={props.id} onChange={onChange} />;
		};
	}

	return {
		...stripe,
		CardNumberElement: createStripeElementMock('cardNumber'),
		CardExpiryElement: createStripeElementMock('cardExpiry'),
		CardCvcElement: createStripeElementMock('cardCvc'),
		Element: () => mockElement,
		useStripe: mockStripe,
		useElements: mockElements,
	};
});
