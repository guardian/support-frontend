import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans14,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import {
	Button,
	SvgChevronDownSingle,
} from '@guardian/source/react-components';
import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useState } from 'react';
import {
	BenefitsCheckList,
	type BenefitsCheckListData,
} from 'components/checkoutBenefits/benefitsCheckList';
import { CheckoutNudgeSelector } from 'components/checkoutNudge/checkoutNudge';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import type { StudentDiscount } from 'pages/[countryGroupId]/student/helpers/discountDetails';
import {
	isContributionOnlyProduct,
	isGuardianWeeklyDigitalProduct,
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import type { CheckoutNudgeSettings } from '../../helpers/abTests/checkoutNudgeAbTests';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import { calculateWeeklyPrice } from '../../helpers/utilities/utilities';
import { PriceSummary } from './priceSummary';

const componentStyles = css`
	${textSans17}
`;

const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 4px 0 8px 0;
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
	${textSans15};
	color: ${neutral[7]};
	border: 1px solid ${neutral[46]};
	border-radius: ${space[3]}px;
	background-color: ${neutral[97]};
	padding: ${space[2]}px ${space[3]}px;
	& div:nth-child(2) {
		margin-top: ${space[3]}px;
		${textSans14};
	}
`;

const startDateWeeklyDigitalList = css`
	${textSans15};
	color: ${neutral[7]};
	border: 1px solid ${neutral[46]};
	border-radius: ${space[3]}px;
	background-color: ${neutral[97]};
	padding: ${space[2]}px ${space[3]}px;
	margin-top: ${space[3]}px;
`;

const startDateList = css`
	display: block;
	${textSans14};
	color: #606060;
	background-color: ${palette.neutral[97]};
	border-radius: ${space[3]}px;
	padding: ${space[3]}px;
	margin-top: ${space[2]}px;
	${from.desktop} {
		margin-top: ${space[4]}px;
	}
`;

const savingTextCss = css`
	color: ${palette.lifestyle[400]};
	${textSans17};
	margin-top: ${space[1]}px;
`;

const weeklyPricingSummary = css`
	display: flex;
	flex-direction: column;
	gap: ${space[1]}px;
	margin-bottom: ${space[5]}px;
	padding: ${space[1]}px 0;

	& div {
		padding: 0;
	}
`;

const savingTextContainer = css`
	padding-top: ${space[0]}px;
`;

export type ContributionsOrderSummaryProps = {
	productKey: ActiveProductKey;
	productLabel: string;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	currency: CurrencyInfo;
	enableCheckList: boolean;
	checkListData: BenefitsCheckListData[];
	startDate: React.ReactNode;
	landingPageSettings: LandingPageVariant;
	ratePlanLabel?: string;
	promotion?: Promotion;
	paymentFrequency?: string;
	onCheckListToggle?: (opening: boolean) => void;
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
	studentDiscount?: StudentDiscount;
	supportRegionId: SupportRegionId;
	nudgeSettings?: CheckoutNudgeSettings;
};

export function ContributionsOrderSummary({
	productKey,
	productLabel,
	ratePlanKey,
	amount,
	currency,
	enableCheckList,
	checkListData,
	startDate,
	landingPageSettings,
	ratePlanLabel,
	promotion,
	paymentFrequency,
	onCheckListToggle,
	headerButton,
	tsAndCs,
	studentDiscount,
	supportRegionId,
	nudgeSettings,
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
		studentDiscount?.fullPriceWithCurrency ??
		simpleFormatAmount(currency, amount);
	const promoDiscountPrice =
		promotion &&
		simpleFormatAmount(currency, promotion.discountedPrice ?? amount);
	const discountPrice =
		studentDiscount?.discountPriceWithCurrency ?? promoDiscountPrice;
	const period = studentDiscount?.periodNoun ?? paymentFrequency;
	const title = `Your ${
		isContributionOnlyProduct(productKey) ? 'support' : 'subscription'
	}`;

	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);
	const isWeeklyDigital = isGuardianWeeklyDigitalProduct(
		productKey,
		ratePlanKey,
	);
	const isWeekly = isGuardianWeeklyProduct(productKey);

	const forceWeeklyPricing =
		window.location.search.includes('force-weekly=true');
	const isWeeklyPricing =
		forceWeeklyPricing || landingPageSettings.name.includes('WEEKLY_PRICE');

	const getDiscountDurationText = (durationMonths: number) => {
		if (durationMonths === 12) {
			return '1 year';
		}
		if (durationMonths === 1) {
			return '1 month';
		}
		return `${durationMonths} months`;
	};

	const savingText = promotion?.discount
		? `You're saving ${
				promotion.discount.amount
		  }% for ${getDiscountDurationText(promotion.discount.durationMonths ?? 0)}`
		: null;

	const billingPeriodObj = ratePlanToBillingPeriod(ratePlanKey);

	const weeklyPrice =
		isWeeklyPricing && !isWeeklyGift && !isWeeklyDigital && !isWeekly
			? simpleFormatAmount(
					currency,
					calculateWeeklyPrice(
						promotion?.discountedPrice ?? amount,
						billingPeriodObj,
					),
			  )
			: undefined;

	return (
		<div css={componentStyles}>
			<div css={[summaryRow, rowSpacing, headingRow]}>
				<h2 css={headingCss}>{title}</h2>
				{headerButton}
			</div>
			<hr css={hrCss} />
			<div css={detailsSection}>
				<div css={summaryRow}>
					<div>
						{ratePlanLabel && <p>{ratePlanLabel}</p>}
						<p>
							{isWeeklyGift
								? 'Guardian Weekly Gift Subscription'
								: productLabel}
						</p>
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
						{!isWeekly && <div css={startDateList}>{startDate}</div>}
					</>
				)}
			</div>

			<hr css={hrCss} />
			{weeklyPrice ? (
				<div css={weeklyPricingSummary}>
					<div css={summaryRow}>
						<p>Weekly price</p>
						<p>{weeklyPrice}</p>
					</div>
					<div css={[summaryRow, boldText]}>
						<p>Total due every {period}</p>
						<p>{discountPrice ?? fullPrice}</p>
					</div>
					{savingText && (
						<div css={savingTextContainer}>
							<hr css={hrCss}/>
							<p css={savingTextCss}>{savingText}</p>
						</div>
					)}
				</div>
			) : (
				<div css={[summaryRow, rowSpacing, boldText, totalRow(!!tsAndCs)]}>
					<p>Total</p>
					<PriceSummary
						fullPrice={fullPrice}
						period={period}
						discountPrice={discountPrice}
						isWeeklyGift={isWeeklyGift}
					/>
				</div>
			)}
			{!!tsAndCs && <div css={termsAndConditions}>{tsAndCs}</div>}
			{isWeeklyDigital && (
				<div css={startDateWeeklyDigitalList}>{startDate}</div>
			)}
			{nudgeSettings && (
				<CheckoutNudgeSelector
					nudgeSettings={nudgeSettings}
					currentProduct={productKey}
					currentRatePlan={ratePlanKey}
					supportRegionId={supportRegionId}
					landingPageSettings={landingPageSettings}
				/>
			)}
		</div>
	);
}
