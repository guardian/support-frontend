import { css } from '@emotion/react';
import { space, textSans } from '@guardian/source-foundations';

const footer = css`
	${textSans.small()};
	margin: ${space[2]}px;
`;

function ThankYouFooter(): JSX.Element {
	return (
		<div css={footer}>
			If you have any questions about contributing to the Guardian, please
			contact our customer service team.
		</div>
	);
}

export default ThankYouFooter;
