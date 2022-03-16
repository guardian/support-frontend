// ----- Imports ----- //
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';

// ----- Render ----- //
function NonInteractiveButton({
	modifierClasses,
	...props
}: SharedButtonPropTypes) {
	return (
		<SharedButton
			element="div"
			modifierClasses={['non-interactive', ...modifierClasses]}
			{...props}
		/>
	);
}

NonInteractiveButton.defaultProps = { ...defaultProps };
export default NonInteractiveButton;
