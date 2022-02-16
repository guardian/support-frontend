// ----- Imports ----- //
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';

// ----- Render ----- //
export type PropTypes = SharedButtonPropTypes & {
	'aria-label'?: string | null | undefined;
	href: string;
	onClick?: () => void;
};

function AnchorButton(props: PropTypes): JSX.Element {
	return <SharedButton element="a" {...props} />;
}

AnchorButton.defaultProps = { ...defaultProps, 'aria-label': null };
export default AnchorButton;
