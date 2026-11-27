import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { observerLinks } from 'helpers/legal';

const preContractLinkStyle = css`
	border-top: 1px solid ${neutral[73]};
	padding-top: ${space[2]}px;
`;

export function ObserverPolicy(): JSX.Element {
	return (
		<>
			<p>
				We'll send you an email reminder every 6 months, and 7 days before your
				next payment.
			</p>
			<p>
				You can cancel for a full refund within 14 days of signing up or within
				14 days of your first newspaper, whichever is later. Follow this link to
				find out more about your cancellation rights.
			</p>
			<p css={preContractLinkStyle}>
				See more details about your subscription in your full pre-contract
				information <a href={observerLinks.PRE_CONTRACT}>here</a>.
			</p>
		</>
	);
}
