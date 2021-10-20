// ----- Imports ----- //
import React from 'react';
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';

// ----- Render ----- //
const NonInteractiveButton = ({
	modifierClasses,
	...props
}: SharedButtonPropTypes) => (
	<SharedButton
		element="div"
		modifierClasses={['non-interactive', ...modifierClasses]}
		{...props}
	/>
);

NonInteractiveButton.defaultProps = { ...defaultProps };
export default NonInteractiveButton;
