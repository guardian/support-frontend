import { css } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source-foundations';
import {
	Button,
	SvgChevronDownSingle,
} from '@guardian/source-react-components';
import { useState } from 'react';
import type { CheckListData } from 'components/checkmarkList/checkmarkList';
import { CheckmarkList } from 'components/checkmarkList/checkmarkList';
import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { Currency } from 'helpers/internationalisation/currency';

const componentStyles = css`
	${textSans.medium()}
`;

const summaryRow = css`
	display: 'flex';
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
	contributionType: ContributionType;
	total: number;
	currency: Currency;
	checkListData: CheckListData[];
	onAccordionClick?: (opening: boolean) => void;
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
	showTopUpAmounts?: boolean;
	topUpToggleChecked?: boolean;
	topUpToggleOnChange?: () => void;
};

const supportTypes = {
	ONE_OFF: 'Single',
	MONTHLY: 'Monthly',
	ANNUAL: 'Annual',
};

const timePeriods = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

function totalWithFrequency(total: string, contributionType: ContributionType) {
	if (contributionType === 'ONE_OFF') {
		return total;
	}
	return `${total}/${timePeriods[contributionType]}`;
}

export function ContributionsOrderSummary({
	contributionType,
	total,
	currency,
	checkListData,
	onAccordionClick,
	headerButton,
	tsAndCs,
}: ContributionsOrderSummaryProps): JSX.Element {
	const [showDetails, setShowDetails] = useState(false);

	const showAccordion =
		contributionType !== 'ONE_OFF' && checkListData.length > 0;

	const checkmarkList = (
		<CheckmarkList
			checkListData={checkListData}
			style="compact"
			iconColor={palette.brand[500]}
		/>
	);

	return (
		<div css={componentStyles}>
			<div css={[summaryRow, rowSpacing, headingRow]}>
				<h2 css={heading}>Your support</h2>
				{headerButton}
			</div>
			<hr css={hrCss} />
			<div css={detailsSection}>
				<div css={summaryRow}>
					<p>{supportTypes[contributionType]} support</p>
					{showAccordion && (
						<Button
							priority="subdued"
							aria-expanded={showDetails ? 'true' : 'false'}
							onClick={() => {
								onAccordionClick?.(!showDetails);
								setShowDetails(!showDetails);
							}}
							icon={<SvgChevronDownSingle />}
							iconSide="right"
							cssOverrides={[buttonOverrides, iconCss(showDetails)]}
						>
							{showDetails ? 'Hide details' : 'View details'}
						</Button>
					)}
				</div>

				{showAccordion && showDetails && (
					<div css={checklistContainer}>{checkmarkList}</div>
				)}
			</div>

			<hr css={hrCss} />
			<div css={[summaryRow, rowSpacing, boldText, totalRow(!!tsAndCs)]}>
				<p>Total</p>
				<p>
					{totalWithFrequency(
						simpleFormatAmount(currency, total),
						contributionType,
					)}
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
