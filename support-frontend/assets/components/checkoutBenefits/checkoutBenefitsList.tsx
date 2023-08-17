import { css } from '@emotion/react';
import {
	from,
	headline,
	neutral,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { CheckmarkList } from 'components/checkmarkList/checkmarkList';
import type { CheckListData } from 'components/checkmarkList/checkmarkList';

const containerCss = css`
	${textSans.medium({ lineHeight: 'tight' })};
`;

const containerWithBackgroundCss = css`
	background-color: ${neutral[97]};
	border: 1px solid ${neutral[86]};
	padding: ${space[3]}px ${space[3]}px ${space[4]}px;
	border-radius: 7px;
`;

const maxWidth = css`
	max-width: 250px;
	${from.desktop} {
		max-width: 280px;
	}
`;
const headingCss = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 28px;
		line-height: 115%;
	}
`;

const hrCss = (margin: string) => css`
	border: none;
	height: 1px;
	background-color: #dcdcdc;
	margin: ${margin};
	${until.tablet} {
		margin: 14px 0;
	}
`;

export type CheckoutBenefitsListProps = {
	title: string;
	checkListData: CheckListData[];
	buttonCopy: string | null;
	handleButtonClick: () => void;
	withBackground?: boolean;
	twoStepBenefitsList?: boolean;
};

export function CheckoutBenefitsList({
	title,
	checkListData,
	withBackground,
	twoStepBenefitsList,
}: CheckoutBenefitsListProps): JSX.Element {
	return (
		<div
			css={
				withBackground
					? [containerCss, containerWithBackgroundCss]
					: [containerCss]
			}
		>
			<h2 css={withBackground ? headingCss : [headingCss, maxWidth]}>
				{title}
			</h2>
			<hr css={hrCss(`${space[4]}px 0`)} />
			<CheckmarkList
				checkListData={checkListData}
				style={twoStepBenefitsList ? 'compact' : 'standard'}
				iconColor={palette.brand[500]}
			/>
			{!withBackground && <hr css={hrCss(`${space[5]}px 0 ${space[4]}px`)} />}
		</div>
	);
}
