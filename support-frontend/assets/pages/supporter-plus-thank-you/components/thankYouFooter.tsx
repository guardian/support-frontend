import { css } from '@emotion/react';
import { from, space, textSans15 } from '@guardian/source/foundations';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

const footer = css`
	${textSans15};
	margin-top: ${space[2]}px;
	margin-bottom: 28px;

	${from.desktop} {
		min-height: 20px;
		margin-bottom: ${space[2]}px;
	}
`;

interface ThankYouFooterProps {
	observerPrint?: ObserverPrint;
}
function ThankYouFooter({ observerPrint }: ThankYouFooterProps): JSX.Element {
	return (
		<div css={footer}>
			{!observerPrint
				? 'If you have any questions about supporting the Guardian, please contact	our customer service team.'
				: ''}
		</div>
	);
}

export default ThankYouFooter;
