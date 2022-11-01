import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, headline, space } from '@guardian/source-foundations';
import * as React from 'react';

type ContributionAmountLabelProps = {
	children: React.ReactNode;
	cssOverrides?: SerializedStyles;
};
const container = css`
	margin-bottom: ${space[3]}px;
	${headline.xxxsmall()}
	font-weight: bold;

	${from.desktop} {
		font-size: 20px;
	}
`;

function ContributionAmountRecurringNotification({
	children,
	cssOverrides,
}: ContributionAmountLabelProps): JSX.Element {
	return <div css={[container, cssOverrides]}>{children}</div>;
}

export default ContributionAmountRecurringNotification;
