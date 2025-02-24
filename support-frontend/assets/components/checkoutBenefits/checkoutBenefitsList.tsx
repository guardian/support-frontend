import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold24,
	headlineBold28,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import type { BenefitsCheckListData } from './benefitsCheckList';
import { BenefitsCheckList } from './benefitsCheckList';

const containerCss = css`
	${textSans17};
	line-height: 1.15;
`;

const containerWithBackgroundCss = css`
	background-color: ${palette.neutral[97]};
	border: 1px solid ${palette.neutral[86]};
	padding: ${space[3]}px ${space[3]}px ${space[4]}px;
	border-radius: 7px;
`;

const smallMaxWidth = css`
	max-width: 250px;
	${from.desktop} {
		max-width: 280px;
	}
`;
const maxWidth = css`
	${until.mobileLandscape} {
		max-width: 15ch;
	}
	${between.tablet.and.desktop} {
		max-width: 15ch;
	}
`;

const headingCss = css`
	${headlineBold24}
	${from.tablet} {
		${headlineBold28};
		line-height: 1.15;
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
	checkListData: BenefitsCheckListData[];
	buttonCopy: string | null;
	handleButtonClick: () => void;
	withBackground?: boolean;
	isCompactList?: boolean;
};

export function CheckoutBenefitsList({
	title,
	checkListData,
	withBackground,
	isCompactList,
}: CheckoutBenefitsListProps): JSX.Element {
	return (
		<div
			css={
				withBackground
					? [containerCss, containerWithBackgroundCss]
					: [containerCss]
			}
		>
			<h2
				css={
					withBackground ? [headingCss, maxWidth] : [headingCss, smallMaxWidth]
				}
			>
				<span>{title}</span>
			</h2>
			<hr css={hrCss(`${space[4]}px 0`)} />
			<BenefitsCheckList
				benefitsCheckListData={checkListData}
				style={isCompactList ? 'compact' : 'standard'}
				iconColor={palette.brand[500]}
			/>
			{!withBackground && <hr css={hrCss(`${space[5]}px 0 ${space[4]}px`)} />}
		</div>
	);
}
