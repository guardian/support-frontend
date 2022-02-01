// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';

// ----- Types ----- //
export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
type PropTypes = {
	size: HeadingSize;
	className: string;
	children: ReactNode;
};

// ----- Component ----- //
export default function Heading(props: PropTypes): JSX.Element {
	switch (props.size) {
		case 1:
			return <h1 className={props.className}>{props.children}</h1>;

		case 2:
			return <h2 className={props.className}>{props.children}</h2>;

		case 3:
			return <h3 className={props.className}>{props.children}</h3>;

		case 4:
			return <h4 className={props.className}>{props.children}</h4>;

		case 5:
			return <h5 className={props.className}>{props.children}</h5>;

		case 6:
		default:
			return <h6 className={props.className}>{props.children}</h6>;
	}
}
