import { css } from '@emotion/react';
import { palette, space, textSans } from '@guardian/source-foundations';

interface ThreeTierLozengeProps {
	title: string;
	subdue?: boolean;
}

const container = (isSubdued?: boolean) => css`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: ${space[1]}px ${space[4]}px;
	border-radius: ${space[1]}px;
	background-color: ${isSubdued ? palette.neutral[100] : palette.brand[500]};
	color: ${isSubdued ? '#606060' : palette.neutral[100]};
	border: 1px solid ${isSubdued ? palette.neutral[60] : palette.brand[500]};
	${textSans.small({ fontWeight: 'bold' })};
`;

export function ThreeTierLozenge({
	title,
	subdue,
}: ThreeTierLozengeProps): JSX.Element {
	return <div css={container(subdue)}>{title}</div>;
}
