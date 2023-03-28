import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import { CheckoutSupportOnceButton } from './checkoutSupportOnceButton';

const container = css`
	display: flex;
	flex-direction: column;
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
	justify-content: space-between;

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
	text-align: left;
	${textSans.small({ lineHeight: 'regular' })};

	${from.desktop} {
		${textSans.medium({ lineHeight: 'regular' })};
	}
`;
const box = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
	&:hover {
		cursor: pointer;
	}
`;
const mainStyles = css`
	display: block;
	overflow: hidden;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border: 1px solid ${neutral[86]};
	border-radius: ${space[3]}px;

	:not(:last-child) {
		margin-bottom: ${space[3]}px;

		${from.mobileLandscape} {
			margin-bottom: ${space[4]}px;
		}
	}
`;

export type CheckoutSupportOnceProps = {
	contributionType: ContributionType;
	supportOnceTitle: string;
	supportOnceParagraph: string;
	onSupportOnceClick: () => void;
};

export function CheckoutSupportOnce({
	contributionType,
	supportOnceTitle,
	supportOnceParagraph,
	onSupportOnceClick,
}: CheckoutSupportOnceProps): JSX.Element | null {
	if (contributionType !== 'ONE_OFF') {
		return (
			<a onClick={onSupportOnceClick} css={[mainStyles, box]}>
				<div css={container}>
					<div css={top}>
						<h2 css={heading(brand[500])}>{supportOnceTitle}</h2>
					</div>
					<div css={bottom}>
						<p css={para}>{supportOnceParagraph}</p>
						<CheckoutSupportOnceButton onClick={onSupportOnceClick} />
					</div>
				</div>
			</a>
		);
	} else {
		return null;
	}
}
