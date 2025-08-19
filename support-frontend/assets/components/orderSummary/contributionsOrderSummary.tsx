import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans14,
	textSans17,
	visuallyHidden,
} from '@guardian/source/foundations';
import {
	Button,
	SvgChevronDownSingle,
} from '@guardian/source/react-components';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { useState } from 'react';
import {
	BenefitsCheckList,
	type BenefitsCheckListData,
} from 'components/checkoutBenefits/benefitsCheckList';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { Currency } from 'helpers/internationalisation/currency';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import type { StudentDiscount } from 'pages/[countryGroupId]/student/helpers/discountDetails';

const componentStyles = css`
	${textSans17}
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

const headingCss = css`
	${headlineBold24}
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
	${textSans14};
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

const orderSummarySundayDetails = css`
	${textSans14};
	color: ${neutral[38]};
	background-color: ${neutral[97]};
	margin-top: ${space[6]}px;
	padding: ${space[3]}px;
	border-radius: ${space[3]}px;
`;

const termsAndConditions = css`
	${textSans17};
	color: ${neutral[0]};
	p {
		margin-top: ${space[1]}px;
	}
`;

export type ContributionsOrderSummaryProps = {
	productKey: ProductKey;
	productDescription: string;
	ratePlanKey: ActiveRatePlanKey;
	ratePlanDescription?: string;
	amount: number;
	promotion?: Promotion;
	currency: Currency;
	enableCheckList: boolean;
	checkListData: BenefitsCheckListData[];
	startDate: React.ReactNode;
	paymentFrequency?: string;
	onCheckListToggle?: (opening: boolean) => void;
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
	tsAndCsTier3?: React.ReactNode;
	studentDiscount?: StudentDiscount;
};

const visuallyHiddenCss = css`
	${visuallyHidden};
`;

export function ContributionsOrderSummary({
	productKey,
	productDescription,
	ratePlanKey,
	ratePlanDescription,
	amount,
	promotion,
	currency,
	paymentFrequency,
	checkListData,
	onCheckListToggle,
	headerButton,
	tsAndCs,
	startDate,
	enableCheckList,
	studentDiscount,
}: ContributionsOrderSummaryProps): JSX.Element {
	const [showCheckList, setCheckList] = useState(false);
	const isSundayOnlyNewspaperSubscription = isSundayOnlyNewspaperSub(
		productKey,
		ratePlanKey,
	);

	const hasCheckList = enableCheckList && checkListData.length > 0;
	const checkList = hasCheckList && (
		<BenefitsCheckList
			benefitsCheckListData={checkListData}
			style="compact"
			iconColor={palette.brand[500]}
		/>
	);

	const fullPrice =
		ratePlanKey === 'OneYearStudent' && studentDiscount
			? studentDiscount.fullPriceWithCurrency
			: simpleFormatAmount(currency, amount);

	const promoDiscountPrice =
		promotion &&
		simpleFormatAmount(currency, promotion.discountedPrice ?? amount);
	const discountPrice =
		ratePlanKey === 'OneYearStudent' && studentDiscount
			? studentDiscount.discountPriceWithCurrency
			: promoDiscountPrice;

	const period = studentDiscount?.periodNoun ?? paymentFrequency;

	function displayPeriod(price: string): string {
		return `${price}${period ? `/${period}` : ''}`;
	}

	return (
		<div css={componentStyles}>
			<div css={[summaryRow, rowSpacing, headingRow]}>
				<h2 css={headingCss}>Your subscription</h2>
				{headerButton}
			</div>
			<hr css={hrCss} />
			<div css={detailsSection}>
				<div css={summaryRow}>
					<div>
						{ratePlanDescription && <p>{ratePlanDescription}</p>}
						<p>{productDescription}</p>
					</div>
					{(hasCheckList || isSundayOnlyNewspaperSubscription) && (
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
					<>
						<div css={checklistContainer}>{checkList}</div>
						{startDate}
					</>
				)}
				{isSundayOnlyNewspaperSubscription && showCheckList && (
					<div css={orderSummarySundayDetails}>
						{productKey === 'HomeDelivery'
							? 'Print edition, delivered every Sunday. All Observer readers also gain free access to the Observer digital newsletters and thought-provoking podcasts, and book tickets to Observer events.'
							: 'Print edition every Sunday. All readers can also gain free access to the Observer digital newsletters and thought-provoking podcasts, and book tickets to Observer events.'}
					</div>
				)}
			</div>

			<hr css={hrCss} />
			<div css={[summaryRow, rowSpacing, boldText, totalRow(!!tsAndCs)]}>
				<p>Total</p>
				<p>
					{discountPrice && (
						<>
							<span css={originalPriceStrikeThrough}>
								<span css={visuallyHiddenCss}>Was </span>
								{fullPrice}
								<span css={visuallyHiddenCss}>, now</span>
							</span>{' '}
							{displayPeriod(discountPrice)}
						</>
					)}
					{!discountPrice && <>{displayPeriod(fullPrice)}</>}
				</p>
			</div>
			{!!tsAndCs && <div css={termsAndConditions}>{tsAndCs}</div>}
		</div>
	);
}
