import { css, ThemeProvider } from '@emotion/react';
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
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import type { RegularContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import type {
	Currency,
	IsoCurrency,
} from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import type { LandingPageProductDescription } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { ThreeTierCardPill } from './threeTierCardPill';

export type ThreeTierCardProps = {
	product: 'TierThree' | 'SupporterPlus' | 'Contribution';
	cardTier: 1 | 2 | 3;
	promoCount: number;
	isSubdued: boolean;
	isUserSelected: boolean;
	currencyId: IsoCurrency;
	paymentFrequency: RegularContributionType;
	link: string;
	productDescription: LandingPageProductDescription;
	price: number;
	ctaCopy: string;
	pillCopy?: string;
	promotion?: Promotion;
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

const titleCss = css`
	${textSansBold15};
	color: #606060;
`;

const priceCss = (hasPromotion: boolean) => css`
	${textSansBold24};
	position: relative;
	margin-bottom: ${hasPromotion ? '0' : `${space[4]}px`};

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

const discountSummaryCopy = (
	currency: Currency,
	promoCount: number,
	price: number,
	promotion: Promotion,
	paymentFrequency: RegularContributionType,
) => {
	/**
	 * EXAMPLE:
	 * - £6/month for the first month, then £10/month
	 * - £6.5/month for 6 months, then £10/month
	 * - £173/year for the first year, then £275/year
	 */
	const durationMonths = promotion.discount?.durationMonths ?? 0;
	const formattedPrice = simpleFormatAmount(currency, price);
	const formattedPromotionPrice = simpleFormatAmount(
		currency,
		promotion.discountedPrice ?? 0,
	);
	const period = paymentFrequency === 'ANNUAL' ? 'year' : 'month';
	const duration =
		paymentFrequency === 'ANNUAL' ? durationMonths / 12 : durationMonths;

	return `${formattedPromotionPrice}/${period} for ${
		period === 'year' || duration === 1 ? 'the first' : ''
	}${duration > 1 ? duration : ''} ${period}${
		duration > 1 ? 's' : ''
	}, then ${formattedPrice}/${period}${'*'.repeat(promoCount)}`;
};

export function ThreeTierCard({
	product,
	cardTier,
	promoCount,
	isSubdued,
	isUserSelected,
	currencyId,
	paymentFrequency,
	link,
	productDescription,
	price,
	promotion,
	ctaCopy,
	pillCopy,
}: ThreeTierCardProps): JSX.Element {
	const currency = currencies[currencyId];
	const period = recurringContributionPeriodMap[paymentFrequency];
	const formattedPrice = simpleFormatAmount(currency, price);
	const quantumMetricButtonRef = `tier-${cardTier}-button`;
	const { title, benefits } = productDescription;

	return (
		<section css={container(!!pillCopy, isUserSelected, isSubdued)}>
			{isUserSelected && <ThreeTierCardPill title="Your selection" />}
			{!!pillCopy && !isUserSelected && (
				<ThreeTierCardPill
					subdue={isSubdued}
					title={promotion?.landingPage?.roundel ?? pillCopy}
				/>
			)}
			<h2 css={titleCss}>{title}</h2>
			<p css={priceCss(!!promotion)}>
				{promotion && (
					<>
						<span css={previousPriceStrikeThrough}>{formattedPrice}</span>{' '}
						{`${simpleFormatAmount(
							currency,
							promotion.discountedPrice ?? price,
						)}/${period}`}
						<span css={discountSummaryCss}>
							{discountSummaryCopy(
								currency,
								promoCount,
								price,
								promotion,
								paymentFrequency,
							)}
						</span>
					</>
				)}
				{!promotion && `${formattedPrice}/${period}`}
			</p>
			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
				<LinkButton
					href={link}
					cssOverrides={btnStyleOverrides}
					data-qm-trackable={quantumMetricButtonRef}
					aria-label={title}
				>
					{ctaCopy}
				</LinkButton>
			</ThemeProvider>

			{product === 'TierThree' && (
				<div css={benefitsPrefixCss}>
					<span>
						The rewards from <strong>All-access digital</strong>
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
						hideBullet: benefits.length <= 1 && product !== 'TierThree',
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkBenefitList}
			/>
		</section>
	);
}
