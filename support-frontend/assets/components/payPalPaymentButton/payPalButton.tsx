import React from 'react';
import ReactDOM from 'react-dom';

export function PayPalButton(props: PayPalButtonProps): JSX.Element {
	const Button = (window.paypal as unknown as PayPalLegacyWindow).Button.driver(
		'react',
		{
			React,
			ReactDOM,
		},
	);

	return <Button {...props} />;
}
