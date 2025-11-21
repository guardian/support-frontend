import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source/foundations';

const contentBoxMainStyle = css`
	overflow: hidden;
	background-color: ${neutral[100]};
	border: 1px solid ${neutral[100]};
	border-radius: ${space[3]}px;
`;

const contentBoxPaddingStyle = css`
	padding: ${space[3]}px;

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[6]}px;
	}
`;

interface ContentBoxProps {
	children: React.ReactNode;
	removePadding?: boolean;
	cssOverrides?: SerializedStyles;
}

function ContentBox({
	children,
	cssOverrides,
	removePadding = false,
}: ContentBoxProps) {
	return (
		<div
			css={[
				cssOverrides,
				contentBoxMainStyle,
				!removePadding ? contentBoxPaddingStyle : css``,
			]}
		>
			{children}
		</div>
	);
}

export default ContentBox;
