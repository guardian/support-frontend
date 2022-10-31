import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
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

const zipCodeContainer = css`
	display: block;
`;

const inlineContainer = css`
	display: flex;

	& *:not(:last-of-type) {
		margin-right: ${space[4]}px;
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
				<div css={inlineContainer}>
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
				</div>
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
				{recaptcha && (
					<ElementDecorator
						id="robot-checkbox"
						text="Security check"
						error={errors.recaptcha?.[0]}
						renderElement={() => recaptcha}
					/>
				)}
			</Stack>
		</div>
	);
}
