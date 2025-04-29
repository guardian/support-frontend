import type { PropsForHoc as WithErrorProps } from 'components/forms/customFields/error';
import { Error } from 'components/forms/customFields/error';
import type { PropsForHoc as WithLabelProps } from 'components/forms/label';
import { Label } from 'components/forms/label';
import type { RecaptchaProps } from './recaptcha';
import { Recaptcha } from './recaptcha';

type CombinedProps = WithErrorProps & WithLabelProps & RecaptchaProps;

export function RecaptchaField(props: CombinedProps) {
	const { error, label, id, optional, footer, ...rest } = props;

	return (
		<Label label={label} id={id} optional={optional} footer={footer}>
			<Error error={error}>
				<Recaptcha {...rest} />
			</Error>
		</Label>
	);
}
