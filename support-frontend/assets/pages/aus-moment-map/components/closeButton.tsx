import React from 'react';
type PropTypes = {
	onClick: () => void;
};
export const CloseButton = (props: PropTypes) => (
	<svg
		width="44"
		height="44"
		viewBox="0 0 44 44"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="close-button"
		onClick={props.onClick}
	>
		<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M22.325 24.025L29.5499 30.6499L30.6249 29.5749L24.025 22.325L30.6249 15.075L29.5499 14L22.325 20.625L15.075 14.025L14 15.1L20.625 22.325L14 29.5499L15.075 30.6249L22.325 24.025Z"
		/>
	</svg>
);
