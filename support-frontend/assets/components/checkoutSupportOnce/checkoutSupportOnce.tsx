import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	space,
	textSans,
} from '@guardian/source-foundations';
import { Box } from 'components/checkoutBox/checkoutBox';
import type { ContributionType } from 'helpers/contributions';
import { CheckoutSupportOnceButton } from './checkoutSupportOnceButton';

const container = css`
	border-radius: 12px;
	margin: 10px ${space[3]}px ${space[4]}px;

	${from.desktop} {
		margin: ${space[5]}px ${space[6]}px;
	}
`;
const top = css`
	display: flex;
	flex-direction: row;
	margin-left: 0px;

	${from.desktop} {
		margin-left: 2px;
	}
`;
const bottom = css`
	display: flex;
	flex-direction: row;
	margin-left: 2px;

	${from.desktop} {
		margin-left: 0px;
	}
`;
const heading = (color: string) => css`
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	color: ${color};

	${from.desktop} {
		${headline.xsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
	}
`;
const para = css`
	${textSans.small({ lineHeight: 'regular' })};

	${from.desktop} {
		${textSans.medium({ lineHeight: 'regular' })};
	}
`;

export type CheckoutSupportOnceProps = {
	contributionType: ContributionType;
	supportOnceDisplay: boolean;
	supportOnceTitle: string;
	supportOnceParagraph: string;
	onSupportOnceClick: () => void;
};

export function CheckoutSupportOnce({
	contributionType,
	supportOnceDisplay,
	supportOnceTitle,
	supportOnceParagraph,
	onSupportOnceClick,
}: CheckoutSupportOnceProps): JSX.Element | null {
	if (contributionType !== 'ONE_OFF' && supportOnceDisplay) {
		return (
			<Box>
				<div css={container}>
					<div css={top}>
						<h2 css={heading(brand[500])}>{supportOnceTitle}</h2>
					</div>
					<div css={bottom}>
						<p css={para}>{supportOnceParagraph}</p>
						<CheckoutSupportOnceButton onClick={onSupportOnceClick} />
					</div>
				</div>
			</Box>
		);
	} else {
		return null;
	}
}
