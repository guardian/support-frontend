import { css } from '@emotion/react';
import { background, border, from, space } from '@guardian/source-foundations';
import EndSummary from 'pages/digital-subscription-checkout/components/endSummary/endSummary';
import 'helpers/types/option';

const endSummaryMobile = css`
	display: block;
	padding: ${space[3]}px;
	border-top: 1px solid ${border.secondary};
	background-color: #f6f6f6; /* Using the hex code as ${background.secondary} isn't exposed in the API yet */

	li:last-of-type {
		margin-bottom: 0;
	}

	${from.desktop} {
		display: none;
	}
`;

function EndSummaryMobile(): JSX.Element {
	return (
		<span css={endSummaryMobile}>
			<EndSummary />
		</span>
	);
}

export default EndSummaryMobile;
