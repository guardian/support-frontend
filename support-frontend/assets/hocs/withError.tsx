// ----- Imports ----- //
import React from 'react';
import type { PropsForHoc } from 'components/forms/customFields/error';
import { Error } from 'components/forms/customFields/error';

// ----- Types ----- //
type AugmentedProps<T> = T & PropsForHoc;

type ComponentToWrap<T> = React.ComponentType<T>;

type WithErrorComponent<T> = React.ComponentType<AugmentedProps<T>>;

// ----- Component ----- //
function withError<Props>(
	Component: ComponentToWrap<Props>,
): WithErrorComponent<Props> {
	return function (props: AugmentedProps<Props>): JSX.Element {
		return (
			<Error error={props.error}>
				<Component {...props} />
			</Error>
		);
	};
}

// ----- Exports ----- //
export { withError };
