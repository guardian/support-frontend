// ----- Imports ----- //
import * as React from 'react';
// ----- Types ----- //
type AugmentedProps<Props> = Props & {
	isShown: boolean;
};
type In<Props> = React.ComponentType<Props>;
type Out<Props> = React.ComponentType<AugmentedProps<Props>>;

// ----- Component ----- //
function canShow<Props>(Component: In<Props>): Out<Props> {
	return function ({ isShown, ...props }: AugmentedProps<Props>) {
		return isShown ? <Component {...props} /> : null;
	};
}

// ----- Exports ----- //
export { canShow };
