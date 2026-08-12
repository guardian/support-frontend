import { css } from '@emotion/react';
import { palette, space, textSansBold15 } from '@guardian/source/foundations';

interface ThreeTierLozengeProps {
	title: string;
	color: string;
	subdue?: boolean;
}

const container = (color: string, isSubdued?: boolean) => css`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
	padding: ${space[1]}px ${space[4]}px;
	border-radius: ${space[1]}px;
	background-color: ${isSubdued ? palette.neutral[100] : color};
	color: ${isSubdued ? '#606060' : palette.neutral[100]};
	border: 1px solid ${isSubdued ? palette.neutral[60] : color};
	${textSansBold15};
`;

export function ThreeTierCardPill({
	title,
	color,
	subdue,
}: ThreeTierLozengeProps): JSX.Element {
	return <div css={container(color, subdue)}>{title}</div>;
}
