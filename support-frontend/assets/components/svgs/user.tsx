import React from 'react'; // A user icon, with a head and body.

export default function SvgUser() {
	return (
		<svg
			className="svg-user"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			preserveAspectRatio="xMinYMid"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M10 8.3c1.55 0 3.4-1.75 3.4-3.9S12.15 1 10 1 6.6 2.25 6.6 4.4s2 3.9 3.4 3.9zm5.86 3.4l-.86-.82c-1.67-.58-3.14-.88-5-.88-1.87 0-3.32.3-5 .86l-.86.85L2 18.16l.86.84h14.28l.86-.86-2.14-6.42v-.02z" />
		</svg>
	);
}
