import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans15,
	textSansBold15,
	textSansBold24,
	until,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { BenefitPill } from 'components/checkoutBenefits/benefitPill';
import {
	BenefitsCheckList,
	checkListTextItemCss,
} from 'components/checkoutBenefits/benefitsCheckList';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { getProductLabel } from 'helpers/productCatalog';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import {
	discountSummaryCopy,
	type Promotion,
} from 'helpers/productPrice/promotions';
import { parseBillingPeriodCopy } from 'helpers/utilities/utilities';
import type { LandingPageProductDescription } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { ThreeTierCardPill } from './threeTierCardPill';

export type CardContent = LandingPageProductDescription & {
	isUserSelected: boolean;
	link: string;
	price: number;
	promotion?: Promotion;
	product: 'SupporterPlus' | 'Contribution' | 'DigitalSubscription';
};

export type ThreeTierCardProps = {
	cardContent: CardContent;
	cardTier: 1 | 2 | 3;
	promoCount: number;
	isSubdued: boolean;
	currencyId: IsoCurrency;
	billingPeriod: BillingPeriod;
};

const container = (
	hasPill: boolean,
	isUserSelected: boolean,
	subdueHighlight: boolean,
) => {
	let cardOrder = 2;
	if (hasPill) {
		cardOrder = 1;
	} else if (isUserSelected) {
		cardOrder = 0;
	}
	return css`
		position: ${hasPill || isUserSelected ? 'relative' : 'static'};
		background-color: ${(hasPill && !subdueHighlight) || isUserSelected
			? '#F1FBFF'
			: palette.neutral[100]};
		border-radius: ${space[3]}px;
		padding: 32px ${space[3]}px ${space[6]}px ${space[3]}px;

		${until.desktop} {
			order: ${cardOrder};
			padding-top: ${space[6]}px;
			margin-top: ${hasPill && subdueHighlight ? '15px' : '0'};
		}
	`;
};

const titleContainer = css`
	display: flex;
	justify-content: center;
	gap: ${space[2]}px;
`;

const titleCss = css`
	${textSansBold15};
	color: #606060;
`;

const priceCss = (hasPromotion: boolean, hasBillingPeriodCopy: boolean) => css`
	${textSansBold24};
	position: relative;
	margin-bottom: ${hasPromotion || hasBillingPeriodCopy
		? '0'
		: `${space[4]}px`};

	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

const discountSummaryCss = css`
	display: block;
	font-size: ${space[3]}px;
	font-weight: 400;
	color: #606060;
	margin-bottom: ${space[4]}px;

	${from.desktop} {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		text-align: center;
		margin-bottom: 0;
	}
`;

const previousPriceStrikeThrough = css`
	font-weight: 400;
	text-decoration: line-through;
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[6]}px;
`;

const checkmarkBenefitList = css`
	width: 100%;
	text-align: left;

	${from.desktop} {
		width: 90%;
	}
`;

const benefitsPrefixCss = css`
	${textSans15};
	color: ${palette.neutral[7]};
	text-align: left;

	strong {
		font-weight: bold;
	}
`;

const benefitsPrefixPlus = css`
	${textSans15};
	color: #545454; // neutral[38] unavailable
	display: flex;
	align-items: center;
	margin: ${space[3]}px 0;

	:before,
	:after {
		content: '';
		height: 1px;
		background-color: ${palette.neutral[86]};
		flex-grow: 2;
	}

	:before {
		margin-right: ${space[2]}px;
	}

	:after {
		margin-left: ${space[2]}px;
	}
`;

export function ThreeTierCard({
	cardContent,
	cardTier,
	promoCount,
	isSubdued,
	currencyId,
	billingPeriod,
}: ThreeTierCardProps): JSX.Element {
	const {
		title,
		titlePill,
		benefits,
		isUserSelected,
		promotion,
		price,
		link,
		cta,
		product,
		billingPeriodsCopy,
	} = cardContent;
	const currency = getCurrencyInfo(currencyId);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const formattedPrice = simpleFormatAmount(currency, price);
	const quantumMetricButtonRef = `tier-${cardTier}-button`;
	const pillCopy = promotion?.landingPage?.roundel ?? cardContent.label?.copy;
	const inAdditionToAllAccessDigital = product === 'DigitalSubscription';
	const parsedBillingPeriodsCopy = parseBillingPeriodCopy(
		billingPeriodsCopy ?? '',
		currency,
		price,
		billingPeriod,
	);
	return (
		<section css={container(!!pillCopy, isUserSelected, isSubdued)}>
			{isUserSelected && <ThreeTierCardPill title="Your selection" />}
			{!!pillCopy && !isUserSelected && (
				<ThreeTierCardPill
					subdue={isSubdued}
					title={promotion?.landingPage?.roundel ?? pillCopy}
				/>
			)}
			<div css={titleContainer}>
				{titlePill && <BenefitPill copy={titlePill} />}
				<h2 css={[titleCss, checkListTextItemCss]}>{title}</h2>
			</div>
			<p css={priceCss(!!promotion, !!parsedBillingPeriodsCopy)}>
				{promotion && (
					<>
						<span css={previousPriceStrikeThrough}>{formattedPrice}</span>{' '}
						{`${simpleFormatAmount(
							currency,
							promotion.discountedPrice ?? price,
						)}/${periodNoun}`}
						<span css={discountSummaryCss}>
							{discountSummaryCopy(
								currency,
								promoCount,
								price,
								promotion,
								billingPeriod,
							)}
						</span>
					</>
				)}
				{parsedBillingPeriodsCopy && !promotion && (
					<>
						<span>
							{formattedPrice}/{periodNoun}
						</span>
						<span css={discountSummaryCss}>{parsedBillingPeriodsCopy}</span>
					</>
				)}
				{!promotion &&
					!parsedBillingPeriodsCopy &&
					`${formattedPrice}/${periodNoun}`}
			</p>
			<LinkButton
				href={link}
				cssOverrides={btnStyleOverrides}
				data-qm-trackable={quantumMetricButtonRef}
				aria-label={title}
				theme={themeButtonReaderRevenueBrand}
			>
				{cta.copy}
			</LinkButton>

			{inAdditionToAllAccessDigital && (
				<div css={benefitsPrefixCss}>
					<span>
						The rewards from{' '}
						<strong> {getProductLabel('SupporterPlus')}</strong>
					</span>
					{benefits.length > 0 && <span css={benefitsPrefixPlus}>plus</span>}
				</div>
			)}
			<BenefitsCheckList
				benefitsCheckListData={benefits.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
						pill: benefit.label?.copy,
						hideBullet: benefits.length <= 1,
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkBenefitList}
			/>
		</section>
	);
}
