import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';

const contentBoxMainStyle = css`
	overflow: hidden;
	background-color: ${neutral[100]};
	border: 1px solid ${neutral[100]};
	border-radius: ${space[3]}px;
	padding: ${space[3]}px;
	padding-bottom: ${space[6]}px;
	margin: ${space[3]}px 0;
`;

interface ContentBoxProps {
	children: React.ReactNode;
}

function ContentBox({ children }: ContentBoxProps) {
	return <div css={contentBoxMainStyle}>{children}</div>;
}

export default ContentBox;
