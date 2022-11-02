import React from 'react';
import ReactDOM from 'react-dom';

export function PayPalButton(props: PayPalButtonProps): JSX.Element {
	const Button = window.paypal.Button.driver('react', {
		React,
		ReactDOM,
	});

	return <Button {...props} />;
}
