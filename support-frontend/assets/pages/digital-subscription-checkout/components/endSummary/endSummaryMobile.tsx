import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { border, background } from '@guardian/src-foundations/palette';
import EndSummary from 'pages/digital-subscription-checkout/components/endSummary/endSummary';
import type { Option } from 'helpers/types/option';
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
type PropTypes = {
	orderIsAGift?: Option<boolean>;
};

function EndSummaryMobile(props: PropTypes) {
	return (
		<span css={endSummaryMobile}>
			<EndSummary orderIsAGift={props.orderIsAGift} />
		</span>
	);
}

EndSummaryMobile.defaultProps = {
	orderIsAGift: false,
};
export default EndSummaryMobile;
