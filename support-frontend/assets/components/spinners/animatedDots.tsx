// ----- Imports ----- //
import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './animatedDots.scss';
// ----- Component ----- //
type PropTypes = {
	appearance: 'light' | 'medium' | 'dark';
	modifierClasses: Array<string | null | undefined>;
};
export default function AnimatedDots(props: PropTypes) {
	return (
		<div
			className={classNameWithModifiers('component-animated-dots', [
				props.appearance,
				...props.modifierClasses,
			])}
		>
			<div className="component-animated-dots__bounce1" />
			<div className="component-animated-dots__bounce2" />
			<div className="component-animated-dots__bounce3" />
		</div>
	);
}
AnimatedDots.defaultProps = {
	modifierClasses: [],
};
