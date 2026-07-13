import { css } from '@emotion/react';
import { neutral, space, textSans12 } from '@guardian/source/foundations';

const tsAndCsContainer = css`
	// In the weekly pricing context, child divs are given a padding of 0, we
	// need to override that here.
	padding: ${space[2]}px 0 0 0 !important;
`;

const tsAndCsText = css`
	${textSans12};
	color: ${neutral[38]};
`;

export function TaxTsAndCs() {
	return (
		<div css={tsAndCsContainer}>
			<p css={tsAndCsText}>
				Tax is calculated based on your province and, if applicable, will be
				applied at the point of payment.
			</p>
		</div>
	);
}
