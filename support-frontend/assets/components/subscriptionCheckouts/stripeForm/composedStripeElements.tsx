import type * as stripeJs from '@stripe/react-stripe-js';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import type { WithErrorProps } from 'components/forms/customFields/error';
import { Error } from 'components/forms/customFields/error';
import type { WithLabelProps } from 'components/forms/label';
import Label from 'components/forms/label';
import type { RecaptchaProps } from 'components/recaptcha/recaptcha';
import { Recaptcha } from 'components/recaptcha/recaptcha';

type WithErrorAndLabelProps = WithErrorProps & WithLabelProps;

export function CardNumberWithError(
	props: stripeJs.CardNumberElementProps & WithErrorAndLabelProps,
) {
	const { error, label, id, optional, footer } = props;

	return (
		<Label label={label} htmlFor={id} optional={optional} footer={footer}>
			<Error error={error}>
				<CardNumberElement {...props} />
			</Error>
		</Label>
	);
}

export function CardExpiryWithError(
	props: stripeJs.CardExpiryElementProps & WithErrorAndLabelProps,
) {
	const { error, label, id, optional, footer } = props;

	return (
		<Label label={label} htmlFor={id} optional={optional} footer={footer}>
			<Error error={error}>
				<CardExpiryElement {...props} />
			</Error>
		</Label>
	);
}

export function CardCvcWithError(
	props: stripeJs.CardCvcElementProps & WithErrorAndLabelProps,
) {
	const { error, label, id, optional, footer } = props;

	return (
		<Label label={label} htmlFor={id} optional={optional} footer={footer}>
			<Error error={error}>
				<CardCvcElement {...props} />
			</Error>
		</Label>
	);
}

export function RecaptchaWithError(
	props: RecaptchaProps & WithErrorAndLabelProps,
) {
	const { error, label, id, optional, footer } = props;

	return (
		<Label label={label} htmlFor={id} optional={optional} footer={footer}>
			<Error error={error}>
				<Recaptcha {...props} />
			</Error>
		</Label>
	);
}
