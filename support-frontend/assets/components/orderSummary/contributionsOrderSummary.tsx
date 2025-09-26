import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans14,
	textSans17,
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
import { CheckoutNudgeThankYou } from 'components/checkoutNudge/checkoutNudge';
import type { Participations } from 'helpers/abTests/models';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { Currency } from 'helpers/internationalisation/currency';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import type { StudentDiscount } from 'pages/[countryGroupId]/student/helpers/discountDetails';
import { PriceSummary } from './priceSummary';

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
	${textSans17};
	color: ${neutral[0]};
	p {
		margin-top: ${space[1]}px;
	}
	& div:nth-child(2) {
		margin-top: ${space[3]}px;
		${textSans14};
	}
`;

export type ContributionsOrderSummaryProps = {
	productKey: ProductKey;
	productLabel: string;
	ratePlanKey: ActiveRatePlanKey;
	ratePlanLabel?: string;
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
	abParticipations?: Participations;
	studentDiscount?: StudentDiscount;
	isWeeklyGift?: boolean;
};

export function ContributionsOrderSummary({
	productKey,
	productLabel,
	ratePlanKey,
	ratePlanLabel,
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
	abParticipations,
	studentDiscount,
	isWeeklyGift,
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

	/* nudge AB test */
	// get nudge url param
	const urlSearchParams = new URLSearchParams(window.location.search);
	// check value is one of the set of expected values

	const verifyNudgeTypeInput = (input: string | null) => {
		if (input === null || !['toRegular'].includes(input.trim())) {
			return '';
		}

		return input.trim();
	};

	// parameter only passed from nudge CTA so used to determine if should show thanks box
	const nudgeType = verifyNudgeTypeInput(urlSearchParams.get('nudge'));

	// from one time checkout to low regular - show thanks box
	const showLowRegularNudgeThanks = () => {
		const isInNudgeToLowRegular =
			productKey === 'Contribution' &&
			['v1', 'v2'].some((a) => a === abParticipations?.abNudgeToLowRegular);

		return isInNudgeToLowRegular && nudgeType.trim() === 'toRegular';
	};

	const nudgeLowRegularThanks = showLowRegularNudgeThanks() && (
		<CheckoutNudgeThankYou
			abTestVariant={abParticipations?.abNudgeToLowRegular}
		/>
	);

	const productLabelGift = `${
		isWeeklyGift ? 'Guardian Weekly Gift Subscription' : productLabel
	}`;

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
						{ratePlanLabel && <p>{ratePlanLabel}</p>}
						<p>{productLabelGift}</p>
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
			</div>

			<hr css={hrCss} />
			<div css={[summaryRow, rowSpacing, boldText, totalRow(!!tsAndCs)]}>
				<p>Total</p>
				<PriceSummary
					fullPrice={fullPrice}
					period={period}
					discountPrice={discountPrice}
				/>
			</div>
			{nudgeLowRegularThanks}
			{!!tsAndCs && <div css={termsAndConditions}>{tsAndCs}</div>}
		</div>
	);
}
