// ----- Imports ----- //
import React from 'react';
import type { PropsForHoc } from 'components/forms/customFields/error';
import { Error } from 'components/forms/customFields/error';
// ----- Types ----- //
type AugmentedProps<Props> = Props & PropsForHoc;
type In<Props> = React.ComponentType<Props>;
type Out<Props> = React.ComponentType<AugmentedProps<Props>>;

// ----- Component ----- //
function withError<Props>(Component: In<Props>): Out<Props> {
	return ({ error, ...props }: AugmentedProps<Props>) => (
		<Error error={error}>
			<Component {...props} />
		</Error>
	);
}

// ----- Exports ----- //
export { withError };
