import { css } from '@emotion/react';
import { palette, space, textSans } from '@guardian/source-foundations';

interface ThreeTierLozengeProps {
	title: string;
}

const container = css`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: ${space[1]}px ${space[4]}px;
	border-radius: ${space[1]}px;
	background-color: ${palette.brand[500]};
	color: ${palette.neutral[100]};
	${textSans.small({ fontWeight: 'bold' })};
`;

export function ThreeTierLozenge({
	title,
}: ThreeTierLozengeProps): JSX.Element {
	return <div css={container}>{title}</div>;
}
