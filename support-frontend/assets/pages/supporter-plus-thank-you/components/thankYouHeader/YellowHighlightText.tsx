import { css } from '@emotion/react';
import type { ReactNode } from 'react';

const yellowHighlightText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;

export default function YellowHighlightText({
	children,
}: {
	children: ReactNode;
}) {
	return <span css={yellowHighlightText}>{children}</span>;
}
