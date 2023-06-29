import { css } from '@emotion/react';
import { palette, space, textSans } from '@guardian/source-foundations';

const infoBlock = css`
	${textSans.small()};
	background: ${palette.neutral[97]};
	border-radius: 8px;
	padding: ${space[3]}px;
`;

const hrCss = css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
`;

const infoBlockContent = css`
	color: #606060;
	font-size: 13px;
	ul {
		list-style: disc;
		padding-left: ${space[4]}px;
	}
`;

export type InfoBlockProps = {
	header: React.ReactNode;
	content: React.ReactNode;
};

export function InfoBlock({ header, content }: InfoBlockProps): JSX.Element {
	return (
		<div css={infoBlock}>
			{header}
			<hr css={hrCss} />
			<div css={infoBlockContent}>{content}</div>
		</div>
	);
}
