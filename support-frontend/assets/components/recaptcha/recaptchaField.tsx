import { compose } from 'redux';
import type { PropsForHoc as WithErrorProps } from 'components/forms/customFields/error';
import type { PropsForHoc as WithLabelProps } from 'components/forms/label';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';
import type { RecaptchaProps } from './recaptcha';
import { Recaptcha } from './recaptcha';

type WithErrorAndLabelProps = WithErrorProps & WithLabelProps;

export const RecaptchaField = compose<
	React.FC<RecaptchaProps & WithErrorAndLabelProps>
>(
	withLabel,
	withError,
)(Recaptcha);
