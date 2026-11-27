import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { observerLinks } from 'helpers/legal';

const preContractLinkStyle = css`
	border-top: 1px solid ${neutral[73]};
	padding-top: ${space[2]}px;
`;

export default function PreContractLink(): JSX.Element {
	return (
		<>
			<p css={preContractLinkStyle}>
				See more details about your subscription in your full pre-contract
				information <a href={observerLinks.PRE_CONTRACT}>here</a>.
			</p>
		</>
	);
}
