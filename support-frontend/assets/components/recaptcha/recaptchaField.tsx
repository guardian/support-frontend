import type { WithErrorProps } from 'components/forms/customFields/error';
import { Error } from 'components/forms/customFields/error';
import type { WithLabelProps } from 'components/forms/label';
import Label from 'components/forms/label';
import type { RecaptchaProps } from './recaptcha';
import { Recaptcha } from './recaptcha';

type CombinedProps = WithErrorProps & WithLabelProps & RecaptchaProps;

export function RecaptchaField(props: CombinedProps) {
	const { error, label, id, optional, footer } = props;

	return (
		<Label label={label} id={id} optional={optional} footer={footer}>
			<Error error={error}>
				<Recaptcha {...props} />
			</Error>
		</Label>
	);
}
