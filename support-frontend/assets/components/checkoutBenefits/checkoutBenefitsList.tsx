import { css } from '@emotion/react';
import {
	between,
	from,
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
	${textSans.small()}
	strong {
		font-weight: bold;
	}
	${from.tablet} {
		${textSans.medium({ lineHeight: 'tight' })}
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
	title: Array<string | { copy: string; strong: boolean }>;
	checkListData: CheckListData[];
	buttonCopy: string | null;
	handleButtonClick: () => void;
	withBackground?: boolean;
	isCompactList?: boolean;
	displayEmotionalBenefit?: boolean;
};

export function CheckoutBenefitsList({
	title,
	checkListData,
	withBackground,
	isCompactList,
	displayEmotionalBenefit,
}: CheckoutBenefitsListProps): JSX.Element {
	const titleCopy = title.map((stringPart) => {
		if (typeof stringPart === 'string') {
			return stringPart;
		} else {
			return <strong>{stringPart.copy}</strong>;
		}
	});
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
					withBackground
						? displayEmotionalBenefit
							? [headingCss]
							: [headingCss, maxWidth]
						: [headingCss, smallMaxWidth]
				}
			>
				<span>{titleCopy}</span>
			</h2>
			<hr css={hrCss(`${space[4]}px 0`)} />
			<CheckmarkList
				checkListData={checkListData}
				style={isCompactList ? 'compact' : 'standard'}
				iconColor={palette.brand[500]}
			/>
			{!withBackground && <hr css={hrCss(`${space[5]}px 0 ${space[4]}px`)} />}
		</div>
	);
}
