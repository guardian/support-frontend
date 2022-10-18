import { error, neutral, space } from '@guardian/source-foundations';
import { Stack } from '@guardian/source-react-components';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import type { StripeElementStyleVariant } from '@stripe/stripe-js';
import { ElementDecorator } from './elementDecorator';

// Styles for stripe elements
const baseStyles: StripeElementStyleVariant = {
	fontSize: `${space[4]}px`,
	color: neutral[7],
	'::placeholder': {
		color: neutral[100],
	},
};

const invalidStyles: StripeElementStyleVariant = {
	color: error[400],
};

export function StripeCardForm(): JSX.Element {
	return (
		<Stack space={3}>
			<ElementDecorator id="cardNumber" text="Card number">
				<CardNumberElement
					id="cardNumber"
					options={{
						style: {
							base: { ...baseStyles },
							invalid: { ...invalidStyles },
						},
					}}
				/>
			</ElementDecorator>
			<ElementDecorator id="cardExpiry" text="Expiry date">
				<CardExpiryElement
					id="cardExpiry"
					options={{
						style: {
							base: { ...baseStyles },
							invalid: { ...invalidStyles },
						},
					}}
				/>
			</ElementDecorator>
			<ElementDecorator id="cardExpiry" text="CVC">
				<CardCvcElement
					id="cardExpiry"
					options={{
						style: {
							base: { ...baseStyles },
							invalid: { ...invalidStyles },
						},
					}}
				/>
			</ElementDecorator>
		</Stack>
	);
}
