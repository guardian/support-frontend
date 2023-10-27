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
import { CheckoutTopUpAmounts } from 'components/checkoutTopUpAmounts/checkoutTopUpAmounts';
import { CheckoutTopUpAmountsContainer } from 'components/checkoutTopUpAmounts/checkoutTopUpAmountsContainer';
import { CheckoutTopUpToggle } from 'components/checkoutTopUpToggle/checkoutTopUpToggle';
import { CheckoutTopUpToggleContainer } from 'components/checkoutTopUpToggle/checkoutTopUpToggleContainer';
import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { Currency } from 'helpers/internationalisation/currency';

const componentStyles = css`
	${textSans.medium()}
`;

const summaryRow = (withFlexWrap = false) => css`
	display: ${withFlexWrap ? 'flex-wrap' : 'flex'};
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

const spaceBetween = css`
	display: flex;
	justify-content: space-between;
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

const spacerCss = css`
	margin-bottom: ${space[3]}px;
	margin-top: ${space[3]}px;

	${from.desktop} {
		margin-bottom: ${space[4]}px;
		margin-top: ${space[4]}px;
	}
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

const fullDetailsSection = css`
	border: 1px solid ${palette.neutral[86]};
	border-radius: ${space[2]}px;
	padding: ${space[2]}px;
	margin-bottom: 0;

	${from.mobileMedium} {
		margin-bottom: 0;
		padding: ${space[4]}px;
	}
`;

const toggleContainer = css`
	margin-top: ${space[3]}px;
	margin-bottom: ${space[3]}px;

	${from.desktop} {
		margin-top: ${space[4]}px;
		margin-bottom: ${space[4]}px;
	}
`;

const termsAndConditions = css`
	${textSans.xxsmall()}
	color: #606060;

	p {
		margin-top: ${space[1]}px;
	}
`;

type ContributionsOrderSummaryVersion = 'COMPACT' | 'FULL';

export type ContributionsOrderSummaryProps = {
	contributionType: ContributionType;
	total: number;
	currency: Currency;
	checkListData: CheckListData[];
	onAccordionClick?: (opening: boolean) => void;
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
	showTopUpAmounts?: boolean;
	showTopUpToggle?: boolean;
	showPreAmendedTotal?: boolean;
	version?: ContributionsOrderSummaryVersion;
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

function subHeaderText(
	version: ContributionsOrderSummaryVersion,
	contributionType: ContributionType,
) {
	switch (version) {
		case 'FULL':
			return supportTypes[contributionType];
		case 'COMPACT':
		default:
			return `${supportTypes[contributionType]} support`;
	}
}

function showCheckmarks(
	version: ContributionsOrderSummaryVersion,
	showAccordion: boolean,
	showDetails: boolean,
) {
	return version === 'FULL' || (showAccordion && showDetails);
}

function containerStyles(version: ContributionsOrderSummaryVersion) {
	const styles = detailsSection;

	if (version === 'FULL') {
		return [styles, fullDetailsSection];
	}

	return styles;
}

export function ContributionsOrderSummary({
	contributionType,
	total,
	currency,
	checkListData,
	onAccordionClick,
	headerButton,
	tsAndCs,
	showTopUpAmounts,
	showTopUpToggle,
	showPreAmendedTotal,
	version = 'COMPACT',
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
			<div css={[summaryRow(), rowSpacing, headingRow]}>
				<h2 css={heading}>Your support</h2>
				{headerButton}
			</div>
			{version === 'COMPACT' && <hr css={hrCss} />}
			<div css={containerStyles(version)}>
				<div css={summaryRow(showPreAmendedTotal)}>
					<p css={showPreAmendedTotal && spaceBetween}>
						{subHeaderText(version, contributionType)}
						{showPreAmendedTotal && (
							<span>
								{totalWithFrequency(
									simpleFormatAmount(currency, total),
									contributionType,
								)}
							</span>
						)}
					</p>
					{showAccordion && version === 'COMPACT' && (
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
				{version === 'FULL' && <hr css={[hrCss, spacerCss]} />}
				{showCheckmarks(version, showAccordion, showDetails) &&
					(version === 'COMPACT' ? (
						<div css={checklistContainer}>{checkmarkList}</div>
					) : (
						checkmarkList
					))}
			</div>
			{showTopUpAmounts && (
				<CheckoutTopUpAmountsContainer
					renderCheckoutTopUpAmounts={(checkoutTopUpAmounts) => (
						<CheckoutTopUpAmounts
							{...checkoutTopUpAmounts}
							customMargin={`${space[5]}px 0 ${space[4]}px`}
						/>
					)}
				/>
			)}
			{showTopUpToggle && contributionType !== 'ONE_OFF' && (
				<div css={toggleContainer}>
					<CheckoutTopUpToggleContainer
						renderCheckoutTopUpToggle={(checkoutTopUpToggleProps) => (
							<CheckoutTopUpToggle {...checkoutTopUpToggleProps} />
						)}
					/>
				</div>
			)}
			<hr css={hrCss} />
			<div css={[summaryRow(), rowSpacing, boldText, totalRow(!!tsAndCs)]}>
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
