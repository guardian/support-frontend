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

type ErrorLabelProps = WithErrorProps & WithLabelProps;
export type ErrorLabelChildProps = ErrorLabelProps & {
	child?: React.ReactNode;
};
export function CardNumberWithError(
	props: stripeJs.CardNumberElementProps & ErrorLabelProps,
) {
	const { error, label, id, optional, footer } = props;
	return ErrorLabel({
		error,
		label,
		id,
		optional,
		footer,
		child: <CardNumberElement {...props} />,
	});
}

export function CardExpiryWithError(
	props: stripeJs.CardExpiryElementProps & ErrorLabelProps,
) {
	const { error, label, id, optional, footer } = props;
	return ErrorLabel({
		error,
		label,
		id,
		optional,
		footer,
		child: <CardExpiryElement {...props} />,
	});
}

export function CardCvcWithError(
	props: stripeJs.CardCvcElementProps & ErrorLabelProps,
) {
	const { error, label, id, optional, footer } = props;
	return ErrorLabel({
		error,
		label,
		id,
		optional,
		footer,
		child: <CardCvcElement {...props} />,
	});
}

export function RecaptchaWithError(props: RecaptchaProps & ErrorLabelProps) {
	const { error, label, id, optional, footer } = props;
	return ErrorLabel({
		error,
		label,
		id,
		optional,
		footer,
		child: <Recaptcha {...props} />,
	});
}

export function ErrorLabel({
	error,
	label,
	id,
	optional,
	footer,
	child,
}: ErrorLabelChildProps): JSX.Element {
	return (
		<Label label={label} htmlFor={id} optional={optional} footer={footer}>
			<Error error={error}>{child}</Error>
		</Label>
	);
}
