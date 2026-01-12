import type { WithErrorProps } from 'components/forms/customFields/error';
import { Error } from 'components/forms/customFields/error';
import type { WithLabelProps } from 'components/forms/label';
import Label from 'components/forms/label';

type ErrorLabelProps = WithErrorProps & WithLabelProps;
export type ErrorLabelChildProps = ErrorLabelProps & {
	child?: React.ReactNode;
};

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
