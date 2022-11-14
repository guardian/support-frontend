import { css } from '@emotion/react';
import { from, space, textSans } from '@guardian/source-foundations';

const footer = css`
	${textSans.small()};
	margin-top: ${space[2]}px;
	margin-bottom: 28px;

	${from.desktop} {
		margin-bottom: ${space[2]}px;
	}
`;

function ThankYouFooter(): JSX.Element {
	return (
		<div css={footer}>
			If you have any questions about supporting the Guardian, please contact
			our customer service team.
		</div>
	);
}

export default ThankYouFooter;
