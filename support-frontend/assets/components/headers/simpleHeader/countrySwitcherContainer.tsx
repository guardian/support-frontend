import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import type { ReactNode } from 'react';

const topSpacing = css`
	margin-top: ${space[2]}px;
`;

export function CountrySwitcherContainer({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <div css={topSpacing}>{children}</div>;
}
