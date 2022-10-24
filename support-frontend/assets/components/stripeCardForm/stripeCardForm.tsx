import { css } from '@emotion/react';
import { headline } from '@guardian/source-foundations';
import { Inline, Stack, TextInput } from '@guardian/source-react-components';
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

const zipCodeContainer = css`
	display: block;
`;

const inlineOverrides = css`
	margin-left: 0;

	& * {
		margin-bottom: 0;
	}

	& *:first-of-type {
		margin-left: 0;
	}
`;

export type StripeCardFormProps = {
	onCardNumberChange: (event: StripeCardNumberElementChangeEvent) => void;
	onExpiryChange: (event: StripeCardExpiryElementChangeEvent) => void;
	onCvcChange: (event: StripeCardCvcElementChangeEvent) => void;
	onZipCodeChange: (newZipCode: string) => void;
	zipCode: string;
	showZipCode: boolean;
	errors: StripeCardFormDisplayErrors;
	recaptcha?: React.ReactNode;
};

export function StripeCardForm({
	onCardNumberChange,
	onExpiryChange,
	onCvcChange,
	onZipCodeChange,
	zipCode,
	showZipCode,
	errors,
	recaptcha,
}: StripeCardFormProps): JSX.Element {
	return (
		<div>
			<Stack space={3}>
				<legend>
					<h3 css={sectionLegend}>Your card details</h3>
				</legend>
				<ElementDecorator
					id="cardNumber"
					text="Card number"
					error={errors.cardNumber?.[0]}
					renderElement={({ id, options, onFocus, onBlur }) => (
						<CardNumberElement
							{...{ id, options, onFocus, onBlur }}
							onChange={onCardNumberChange}
						/>
					)}
				/>
				<Inline space={3} cssOverrides={inlineOverrides}>
					<ElementDecorator
						id="expiry"
						text="Expiry date"
						error={errors.expiry?.[0]}
						renderElement={({ id, options, onFocus, onBlur }) => (
							<CardExpiryElement
								{...{ id, options, onFocus, onBlur }}
								onChange={onExpiryChange}
							/>
						)}
					/>
					<ElementDecorator
						id="cvc"
						text="CVC"
						error={errors.cvc?.[0]}
						renderElement={({ id, options, onFocus, onBlur }) => (
							<CardCvcElement
								{...{ id, options, onFocus, onBlur }}
								onChange={onCvcChange}
							/>
						)}
					/>
				</Inline>
				{showZipCode && (
					<div css={zipCodeContainer}>
						<TextInput
							id="zipCode"
							name="zip-code"
							label="ZIP code"
							value={zipCode}
							error={errors.zipCode?.[0]}
							onChange={(e) => onZipCodeChange(e.target.value)}
						/>
					</div>
				)}
				{recaptcha}
			</Stack>
		</div>
	);
}
