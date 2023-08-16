import { css } from '@emotion/react';
import {
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
	margin-bottom: 18px;
`;

const boldText = css`
	font-weight: 700;
`;

const heading = css`
	${headline.xsmall({ fontWeight: 'bold' })}
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
`;

const iconCss = (flip: boolean) => css`
	svg {
		max-width: ${space[3]}px;
		transition: transform 0.3s ease-in-out;

		${flip && 'transform: rotate(180deg);'}
	}
`;

const checklistContainer = css`
	margin-top: ${space[5]}px;
`;

const detailsSection = css`
	display: flex;
	flex-direction: column;
`;

const termsAndConditions = css`
	${textSans.xxsmall()}
	color: #606060;
`;

export type ContributionsOrderSummaryProps = {
	contributionType: ContributionType;
	total: string;
	checkListData: CheckListData[];
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
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
	checkListData,
	headerButton,
	tsAndCs,
}: ContributionsOrderSummaryProps): JSX.Element {
	const [showDetails, setShowDetails] = useState(false);

	const showAccordion =
		contributionType !== 'ONE_OFF' && checkListData.length > 0;

	return (
		<div css={componentStyles}>
			<div css={[summaryRow, rowSpacing]}>
				<h2 css={heading}>Your support</h2>
				{headerButton}
			</div>
			<hr css={hrCss} />
			<div css={[detailsSection, rowSpacing]}>
				<div css={summaryRow}>
					<p>{supportTypes[contributionType]} support</p>
					{showAccordion && (
						<Button
							priority="subdued"
							aria-expanded={showDetails ? 'true' : 'false'}
							onClick={() => setShowDetails(!showDetails)}
							icon={<SvgChevronDownSingle />}
							iconSide="right"
							cssOverrides={[buttonOverrides, iconCss(showDetails)]}
						>
							{showDetails ? 'Hide details' : 'View details'}
						</Button>
					)}
				</div>
				{showAccordion && showDetails && (
					<div css={checklistContainer}>
						<CheckmarkList checkListData={checkListData} style="compact" />
					</div>
				)}
			</div>
			<hr css={hrCss} />
			<div css={[summaryRow, rowSpacing, boldText]}>
				<p>Total</p>
				<p>{totalWithFrequency(total, contributionType)}</p>
			</div>
			{tsAndCs ? (
				<div css={termsAndConditions}>
					<hr css={hrCss} />
					{tsAndCs}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
