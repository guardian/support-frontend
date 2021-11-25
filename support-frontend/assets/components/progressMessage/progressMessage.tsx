// ----- Imports ----- //
import React from 'react';
import AnimatedDots from 'components/spinners/animatedDots';
import './progressMessage.scss';
// ---- Types ----- //
type PropTypes = {
	message: string[];
}; // ----- Component ----- //

export default function ProgressMessage(props: PropTypes): JSX.Element {
	return (
		<div className="component-progress-message">
			<div className="component-progress-message__dialog">
				{props.message.map((message) => (
					<div
						className="component-progress-message__message"
						aria-live="polite"
					>
						{message}
					</div>
				))}
				<AnimatedDots appearance="light" />
			</div>
			<div className="component-progress-message__background" />
		</div>
	);
}
