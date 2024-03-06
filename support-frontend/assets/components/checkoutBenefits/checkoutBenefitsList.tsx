import { css } from '@emotion/react';
import {
	between,
	from,
	headline,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { CheckList } from 'components/checkList/checkList';
import type { CheckListData } from 'components/checkList/checkList';

const containerCss = css`
	${textSans.medium({ lineHeight: 'tight' })};
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
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })}
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
			<CheckList
				checkListData={checkListData}
				style={isCompactList ? 'compact' : 'standard'}
				iconColor={palette.brand[500]}
			/>
			{!withBackground && <hr css={hrCss(`${space[5]}px 0 ${space[4]}px`)} />}
		</div>
	);
}
