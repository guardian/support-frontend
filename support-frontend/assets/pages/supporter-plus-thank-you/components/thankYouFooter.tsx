import type { SerializedStyles } from '@emotion/react';
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

type ThankyouFooterProps = {
	copyOverride?: string;
	cssOverrides?: SerializedStyles;
};

function ThankYouFooter({
	copyOverride,
	cssOverrides,
}: ThankyouFooterProps): JSX.Element {
	return (
		<div css={[footer, cssOverrides]}>
			{copyOverride
				? copyOverride
				: 'If you have any questions about supporting the Guardian, please contact our customer service team.'}
		</div>
	);
}

export default ThankYouFooter;
