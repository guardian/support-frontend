// ----- Imports ----- //
import React from 'react';

// ----- Types ----- //
type AugmentedProps<T> = T & {
	isShown: boolean;
};
type ComponentToWrap<T> = React.ComponentType<T>;

type MaybeComponent<T> = React.ComponentType<AugmentedProps<T>>;

// ----- Component ----- //
export function canShow<Props>(
	Component: ComponentToWrap<Props>,
): MaybeComponent<Props> {
	return function (props: AugmentedProps<Props>) {
		return props.isShown ? <Component {...props} /> : null;
	};
}
