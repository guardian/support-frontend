// ----- Imports ----- //
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';
// ----- Render ----- //
type PropTypes = SharedButtonPropTypes & {
	'aria-label'?: string | null | undefined;
	type: ('button' | 'submit') | null | undefined;
	disabled: boolean | null | undefined;
};

function Button(props: PropTypes) {
	return <SharedButton element="button" {...props} />;
}

Button.defaultProps = {
	...defaultProps,
	'aria-label': null,
	type: 'button',
	disabled: false,
};
export default Button;
