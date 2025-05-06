// ----- Imports ----- //
import { InlineError } from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import type { Option } from 'helpers/types/option';
import './error.scss';
// ----- Types ----- //
export type WithErrorProps = {
	error?: string;
};
type Props = WithErrorProps & {
	children?: Option<ReactNode>;
};

// ----- Component ----- //
function Error({ error, children }: Props) {
	return (
		<div className={error ? 'component-form-error' : undefined}>
			{error && <InlineError>{error}</InlineError>}
			{children}
		</div>
	);
}

// ----- Exports ----- //
export { Error };
