import type * as stripeJs from '@stripe/react-stripe-js';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import type React from 'react';
import { compose } from 'redux';
import type { PropsForHoc as WithErrorProps } from 'components/forms/customFields/error';
import type { PropsForHoc as WithLabelProps } from 'components/forms/label';
import type { RecaptchaProps } from 'components/recaptcha/recaptcha';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';

type WithErrorAndLabelProps = WithErrorProps & WithLabelProps;

export const CardNumberWithError = compose<
	React.FC<stripeJs.CardNumberElementProps & WithErrorAndLabelProps>
>(
	withLabel,
	withError,
)(CardNumberElement);

export const CardExpiryWithError = compose<
	React.FC<stripeJs.CardExpiryElementProps & WithErrorAndLabelProps>
>(
	withLabel,
	withError,
)(CardExpiryElement);

export const CardCvcWithError = compose<
	React.FC<stripeJs.CardCvcElementProps & WithErrorAndLabelProps>
>(
	withLabel,
	withError,
)(CardCvcElement);

export const RecaptchaWithError = compose<
	React.FC<RecaptchaProps & WithErrorAndLabelProps>
>(
	withLabel,
	withError,
)(Recaptcha);
