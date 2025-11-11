import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source/foundations';

const contentBoxMainStyle = css`
	overflow: hidden;
	background-color: ${neutral[100]};
	border: 1px solid ${neutral[100]};
	border-radius: ${space[3]}px;
	padding: ${space[3]}px;
	padding-bottom: ${space[6]}px;

	${from.tablet} {
		padding: ${space[8]}px;
	}
`;

interface ContentBoxProps {
	children: React.ReactNode;
	cssOverrides?: SerializedStyles;
}

function ContentBox({ children, cssOverrides }: ContentBoxProps) {
	return <div css={[contentBoxMainStyle, cssOverrides]}>{children}</div>;
}

export default ContentBox;
