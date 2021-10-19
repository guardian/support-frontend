import React from 'react';

const mockElement = () => ({
	mount: jest.fn(),
	destroy: jest.fn(),
	on: jest.fn(),
	update: jest.fn(),
});

const mockElements = () => {
	const elements = {};
	return {
		create: jest.fn((type) => {
			elements[type] = mockElement();
			return elements[type];
		}),
		getElement: jest.fn((type) => elements[type] || null),
	};
};

const mockStripe = () => ({
	elements: jest.fn(() => mockElements()),
	createToken: jest.fn(),
	createSource: jest.fn(),
	createPaymentMethod: jest.fn(),
	confirmCardPayment: jest.fn(),
	confirmCardSetup: jest.fn(),
	handleCardSetup: jest.fn().mockResolvedValue({
		setupIntent: {
			payment_method: 'mock',
		},
	}),
	paymentRequest: jest.fn(),
	_registerWrapper: jest.fn(),
});

jest.mock('@stripe/react-stripe-js', () => {
	const stripe = jest.requireActual('@stripe/react-stripe-js');

	function createStripeElementMock(elementType) {
		type MockStripeElementProps = {
			id: string;
			onChange: (...args: Array<any>) => any;
		};
		return function MockStripeElement(props: MockStripeElementProps) {
			function onChange(evt) {
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
