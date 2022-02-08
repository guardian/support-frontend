// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import type { ReactNode } from 'react';
import React from 'react';

type PropTypes = {
	className: string;
	appearance: {
		centred?: boolean;
		paddingTop?: boolean;
		border?: boolean;
	};
	children: ReactNode;
};
const paddingStyle = css`
	padding-top: ${space[2]}px;
`;
const contentStyle = css`
	position: relative;
	display: flex;
	flex-grow: 1;
	flex-basis: ${space[24] * 10}px;
	padding: 0 ${space[5]}px ${space[4]}px;
	/* padding-bottom: ${space[4]}px; */

	.component-left-margin-section:not(:last-of-type) & {
		border-bottom: 1px solid ${brand[600]};
	}
`;

function getBorderStyling(centred = false) {
	const breakpoint = centred ? from.wide : from.tablet;
	return css`
		${breakpoint} {
			border-left: 1px solid ${brand[600]};
			border-right: 1px solid ${brand[600]};
		}
	`;
}

export function Content({
	className,
	appearance,
	children,
}: PropTypes): JSX.Element {
	const { centred, border, paddingTop } = appearance;
	return (
		<div
			className={className}
			css={[
				contentStyle,
				paddingTop ? paddingStyle : '',
				border ? getBorderStyling(centred) : '',
			]}
		>
			{children}
		</div>
	);
}
Content.defaultProps = {
	appearance: {
		centred: false,
		border: false,
		paddingTop: false,
	},
};
