import { css } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
	visuallyHidden,
} from '@guardian/source-foundations';
import {
	Button,
	SvgChevronDownSingle,
} from '@guardian/source-react-components';
import { useState } from 'react';
import type { CheckListData } from 'components/checkList/checkList';
import { CheckList } from 'components/checkList/checkList';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { Currency } from 'helpers/internationalisation/currency';

const componentStyles = css`
	${textSans.medium()}
`;

const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding-top: 4px;
`;

const rowSpacing = css`
	&:not(:last-child) {
		margin-bottom: ${space[5]}px;

		${from.desktop} {
			margin-bottom: ${space[6]}px;
		}
	}
`;

const boldText = css`
	font-weight: 700;
`;

const headingRow = css`
	padding-top: ${space[2]}px;

	${from.desktop} {
		padding-top: 0;
	}
`;

const totalRow = (hasTsAncCs: boolean) => css`
	${!hasTsAncCs ? `margin-bottom: ${space[3]}px;` : 'margin-bottom: 0;'}

	${from.desktop} {
		margin-bottom: 0;
	}
`;

const heading = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 28px;
	}
`;

const hrCss = css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
	margin: 0;
`;

const buttonOverrides = css`
	min-height: unset;
	height: unset;
	text-decoration: none;
	${textSans.xsmall()};
	color: ${palette.neutral[20]};

	.src-button-space {
		width: ${space[1]}px;
	}
`;

const originalPriceStrikeThrough = css`
	font-weight: 400;
	text-decoration: line-through;
`;

const iconCss = (flip: boolean) => css`
	svg {
		max-width: ${space[4]}px;
		transition: transform 0.3s ease-in-out;

		${flip ? 'transform: rotate(180deg);' : ''}
	}
`;

const checklistContainer = css`
	margin-top: ${space[5]}px;
`;

const detailsSection = css`
	display: flex;
	flex-direction: column;
	margin-bottom: ${space[5]}px;

	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

const termsAndConditions = css`
	${textSans.xxsmall()}
	color: #606060;

	p {
		margin-top: ${space[1]}px;
	}
`;

export type ContributionsOrderSummaryProps = {
	description: string;
	total: number;
	totalExcludingPromo?: number;
	currency: Currency;
	enableCheckList: boolean;
	checkListData: CheckListData[];
	paymentFrequency?: string;
	onCheckListToggle?: (opening: boolean) => void;
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
	threeTierProductName?: string;
	showTopUpAmounts?: boolean;
	topUpToggleChecked?: boolean;
	topUpToggleOnChange?: () => void;
	productDescription?: { description: string; frequency: string };
};

const visuallyHiddenCss = css`
	${visuallyHidden};
`;

export function ContributionsOrderSummary({
	description,
	total,
	totalExcludingPromo,
	currency,
	paymentFrequency,
	checkListData,
	onCheckListToggle,
	headerButton,
	tsAndCs,
	threeTierProductName,
	enableCheckList,
}: ContributionsOrderSummaryProps): JSX.Element {
	const [showCheckList, setCheckList] = useState(false);

	const hasCheckList = enableCheckList && checkListData.length > 0;
	const checkList = hasCheckList && (
		<CheckList
			checkListData={checkListData}
			style="compact"
			iconColor={palette.brand[500]}
		/>
	);

	const formattedTotal = simpleFormatAmount(currency, total);
	const formattedTotalExcludingPromo = simpleFormatAmount(
		currency,
		totalExcludingPromo ?? '',
	);

	return (
		<div css={componentStyles}>
			<div css={[summaryRow, rowSpacing, headingRow]}>
				<h2 css={heading}>
					{threeTierProductName ? 'Your subscription' : 'Your support'}
				</h2>
				{headerButton}
			</div>
			<hr css={hrCss} />
			<div css={detailsSection}>
				<div css={summaryRow}>
					<p>{description}</p>
					{hasCheckList && (
						<Button
							priority="subdued"
							aria-expanded={showCheckList ? 'true' : 'false'}
							onClick={() => {
								onCheckListToggle?.(!showCheckList);
								setCheckList(!showCheckList);
							}}
							icon={<SvgChevronDownSingle />}
							iconSide="right"
							cssOverrides={[buttonOverrides, iconCss(showCheckList)]}
						>
							{showCheckList ? 'Hide details' : 'View details'}
						</Button>
					)}
				</div>

				{hasCheckList && showCheckList && (
					<div css={checklistContainer}>{checkList}</div>
				)}
			</div>

			<hr css={hrCss} />
			<div css={[summaryRow, rowSpacing, boldText, totalRow(!!tsAndCs)]}>
				<p>Total</p>
				<p>
					{totalExcludingPromo && (
						<span css={originalPriceStrikeThrough}>
							<span css={visuallyHiddenCss}>Was </span>
							{formattedTotalExcludingPromo}
							<span css={visuallyHiddenCss}>, now </span>
						</span>
					)}{' '}
					{paymentFrequency
						? `${formattedTotal}/${paymentFrequency}`
						: formattedTotal}
				</p>
			</div>
			{!!tsAndCs && (
				<div css={termsAndConditions}>
					<hr css={hrCss} />
					{tsAndCs}
				</div>
			)}
		</div>
	);
}
