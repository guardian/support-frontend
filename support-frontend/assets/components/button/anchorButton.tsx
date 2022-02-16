// ----- Imports ----- //
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';

// ----- Render ----- //
export type PropTypes = SharedButtonPropTypes & {
	'aria-label'?: string | null | undefined;
	href: string;
	onClick?: () => void;
};

function AnchorButton(props: PropTypes): EmotionJSX.Element {
	return <SharedButton element="a" {...props} />;
}

AnchorButton.defaultProps = { ...defaultProps, 'aria-label': null };
export default AnchorButton;
