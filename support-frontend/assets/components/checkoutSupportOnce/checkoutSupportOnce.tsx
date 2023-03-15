import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import { CheckoutSupportOnceButton } from './checkoutSupportOnceButton';

const container = css`
	border-radius: 12px;
	background-color: ${neutral[97]};
	margin: ${space[3]}px 0;
`;
const top = css`
	display: flex;
	flex-direction: row;
	margin-top: ${space[2]}px;
	margin-bottom: ${space[1]}px;
	//justify-content: space-between;
	${from.mobileMedium} {
		margin-bottom: -${space[3]}px;
	}
`;
const topheading = css`
	margin-top: ${space[3]}px;
`;
const heading = (color: string) => css`
	margin-left: 9px;
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	color: ${color};

	${from.mobileMedium} {
		font-size: 24px;
		line-height: 100%;
	}
	${from.tablet} {
		margin-left: 12px;
		${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
	}
`;
const para = css`
	margin: ${space[1]}px 9px 10px ${space[2]}px;
	${textSans.small({ lineHeight: 'regular' })};

	${from.mobileMedium} {
		max-width: 470px;
	}
	${from.tablet} {
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
	if (contributionType === 'MONTHLY' && supportOnceDisplay) {
		return (
			<div css={container}>
				<div css={top}>
					<div css={topheading}>
						<h2 css={heading(brand[500])}>{supportOnceTitle}</h2>
					</div>
					<CheckoutSupportOnceButton onClick={onSupportOnceClick} />
				</div>
				<p css={para}>{supportOnceParagraph}</p>
			</div>
		);
	} else {
		return null;
	}
}
