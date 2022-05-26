import { css } from '@emotion/react';
import { from, headline, space } from '@guardian/source-foundations';
import * as React from 'react';

type ContributionAmountLabelProps = {
	children: React.ReactNode;
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
}: ContributionAmountLabelProps) {
	return <div css={container}>{children}</div>;
}

export default ContributionAmountRecurringNotification;
