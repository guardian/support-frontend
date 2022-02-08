// ----- Imports ----- //
import { InlineError } from '@guardian/src-user-feedback';
import type { ReactNode } from 'react';
import type { Option } from 'helpers/types/option';
import './error.scss';
// ----- Types ----- //
export type PropsForHoc = {
	error?: string;
};
type Props = PropsForHoc & {
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
