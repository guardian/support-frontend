import { css } from '@emotion/react';
import { neutral, space, textSans12 } from '@guardian/source/foundations';

const tsAndCsContainer = css`
	padding: ${space[3]}px 0 0 0;
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
