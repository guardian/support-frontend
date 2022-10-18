import { Stack } from '@guardian/source-react-components';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import { ElementDecorator } from './elementDecorator';

export function StripeCardForm(): JSX.Element {
	return (
		<Stack space={3}>
			<ElementDecorator
				id="cardNumber"
				text="Card number"
				element={(propsFromDecorator) => (
					<CardNumberElement {...propsFromDecorator} />
				)}
			/>
			<ElementDecorator
				id="cardExpiry"
				text="Expiry date"
				element={(propsFromDecorator) => (
					<CardExpiryElement {...propsFromDecorator} />
				)}
			/>
			<ElementDecorator
				id="cardExpiry"
				text="CVC"
				element={(propsFromDecorator) => (
					<CardCvcElement {...propsFromDecorator} />
				)}
			/>
		</Stack>
	);
}
