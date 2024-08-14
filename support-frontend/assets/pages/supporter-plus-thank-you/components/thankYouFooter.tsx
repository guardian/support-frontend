import { css } from '@emotion/react';
import { from, space, textSans } from '@guardian/source/foundations';

const footer = css`
	${textSans.small()};
	margin-top: ${space[2]}px;
	margin-bottom: 28px;

	${from.desktop} {
		margin-bottom: ${space[2]}px;
	}
`;

type ThankyouFooterProp = {
	copyOverride?: string;
};

function ThankYouFooter({ copyOverride }: ThankyouFooterProp): JSX.Element {
	return (
		<div css={footer}>
			{copyOverride
				? copyOverride
				: 'If you have any questions about supporting the Guardian, please contact our customer service team.'}
		</div>
	);
}

export default ThankYouFooter;
