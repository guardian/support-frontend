// ----- Imports ----- //
import type { Node } from 'react';
import React, { createElement } from 'react';
import type { $Keys } from 'utility-types';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './button.scss';
// ----- PropTypes ----- //
export const Appearances = {
	primary: 'primary',
	secondary: 'secondary',
	tertiary: 'tertiary',
	tertiaryFeature: 'tertiary-feature',
	green: 'green',
	blue: 'blue',
	greenHollow: 'greenHollow',
	greyHollow: 'greyHollow',
	disabled: 'disabled',
};
export const Sides = {
	right: 'right',
	left: 'left',
};
type Appearance = $Keys<typeof Appearances>;
type IconSide = $Keys<typeof Sides>;

/* **********************************************************************
Note: postDeploymentTestID will be prefixed with 'qa' to indicate it is
used in a test and avoid any confusion by anyone looking at the DOM that
we are using ID for anything other than QA testing.
************************************************************************ */
type SharedButtonPropTypes = {
	children: string;
	icon?: Node;
	appearance: Appearance;
	iconSide: IconSide;
	getRef?: (arg0: Element | null | undefined) => void;
	modifierClasses: string[];
	postDeploymentTestID?: string;
};
type PropTypes = SharedButtonPropTypes & {
	element: 'a' | 'button' | 'div';
};

// ----- Render ----- //
const SharedButton = ({
	element,
	appearance,
	iconSide,
	modifierClasses,
	children,
	icon,
	getRef,
	postDeploymentTestID,
	...otherProps
}: PropTypes) => {
	const className = classNameWithModifiers('component-button', [
		appearance,
		`hasicon-${iconSide}`,
		...modifierClasses,
	]);
	const contents = [
		<span className="component-button__content">{children}</span>,
		icon,
	];
	return createElement(
		element,
		{
			className,
			ref: getRef,
			id: postDeploymentTestID ? `qa-${postDeploymentTestID}` : null,
			...otherProps,
		},
		contents,
	);
};

export const defaultProps = {
	icon: <SvgArrowRightStraight />,
	appearance: Object.keys(Appearances)[0],
	iconSide: Object.keys(Sides)[0],
	modifierClasses: [],
};
SharedButton.defaultProps = { ...defaultProps };
export type { SharedButtonPropTypes, IconSide, Appearance };
export default SharedButton;
