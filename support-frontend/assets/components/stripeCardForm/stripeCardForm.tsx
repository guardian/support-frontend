import { css } from '@emotion/react';
import { headline } from '@guardian/source-foundations';
import { Stack, TextInput } from '@guardian/source-react-components';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import type {
	StripeCardCvcElementChangeEvent,
	StripeCardExpiryElementChangeEvent,
	StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { ElementDecorator } from './elementDecorator';
import type { StripeCardFormDisplayErrors } from './selectors';

const sectionLegend = css`
	${headline.xxsmall({ fontWeight: 'bold' })}
`;

type StripeCardFormProps = {
	onCardNumberChange: (event: StripeCardNumberElementChangeEvent) => void;
	onExpiryChange: (event: StripeCardExpiryElementChangeEvent) => void;
	onCvcChange: (event: StripeCardCvcElementChangeEvent) => void;
	onZipCodeChange: (newZipCode: string) => void;
	zipCode: string;
	showZipCode: boolean;
	errors: StripeCardFormDisplayErrors;
};

export function StripeCardForm({
	onCardNumberChange,
	onExpiryChange,
	onCvcChange,
	onZipCodeChange,
	zipCode,
	showZipCode,
	errors,
}: StripeCardFormProps): JSX.Element {
	return (
		<Stack space={3}>
			<legend>
				<h3 css={sectionLegend}>Your card details</h3>
			</legend>
			<ElementDecorator
				id="cardNumber"
				text="Card number"
				error={errors.cardNumber}
				element={({ id, options, onFocus, onBlur }) => (
					<CardNumberElement
						{...{ id, options, onFocus, onBlur }}
						onChange={onCardNumberChange}
					/>
				)}
			/>
			<ElementDecorator
				id="expiry"
				text="Expiry date"
				error={errors.expiry}
				element={({ id, options, onFocus, onBlur }) => (
					<CardExpiryElement
						{...{ id, options, onFocus, onBlur }}
						onChange={onExpiryChange}
					/>
				)}
			/>
			<ElementDecorator
				id="cvc"
				text="CVC"
				error={errors.cvc}
				element={({ id, options, onFocus, onBlur }) => (
					<CardCvcElement
						{...{ id, options, onFocus, onBlur }}
						onChange={onCvcChange}
					/>
				)}
			/>
			{showZipCode && (
				<div
					css={css`
						display: block;
					`}
				>
					<TextInput
						id="zipCode"
						name="zip-code"
						label="ZIP code"
						value={zipCode}
						onChange={(e) => onZipCodeChange(e.target.value)}
					/>
				</div>
			)}
		</Stack>
	);
}
