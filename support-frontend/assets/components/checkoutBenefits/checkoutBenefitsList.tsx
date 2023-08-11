import { css } from '@emotion/react';
import {
	from,
	headline,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { CheckmarkList } from 'components/checkmarkList/checkmarkList';
import type { CheckListData } from 'components/checkmarkList/checkmarkList';

const containerCss = css`
	${textSans.medium({ lineHeight: 'tight' })};
`;

const headingCss = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 28px;
		line-height: 115%;
	}
	max-width: 250px;
	${from.desktop} {
		max-width: 280px;
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
};

export function CheckoutBenefitsList({
	title,
	checkListData,
}: CheckoutBenefitsListProps): JSX.Element {
	return (
		<div css={containerCss}>
			<h2 css={headingCss}>{title}</h2>
			<hr css={hrCss(`${space[4]}px 0`)} />
			<CheckmarkList checkListData={checkListData} />
			<hr css={hrCss(`${space[5]}px 0 ${space[4]}px`)} />
		</div>
	);
}
