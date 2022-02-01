import React from 'react';
import type { ReactNode } from 'react';
import './stripeCardForm.scss';

type PropTypes = {
	label: ReactNode;
	hint?: ReactNode;
	input: ReactNode;
	error: boolean;
	focus: boolean;
};

const getClass = (props: PropTypes) => {
	if (props.focus) {
		return 'ds-stripe-card-input__focus';
	} else if (props.error) {
		return 'ds-stripe-card-input__error';
	}

	return '';
};

export function StripeCardFormField(props: PropTypes): JSX.Element {
	return (
		<>
			<div className="ds-stripe-card-form-field">{props.label}</div>
			{props.hint ?? null}
			<div className={`ds-stripe-card-input ${getClass(props)}`}>
				{props.input}
			</div>
		</>
	);
}
