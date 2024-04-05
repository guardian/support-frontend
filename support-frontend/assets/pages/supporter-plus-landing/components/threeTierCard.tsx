import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source-react-components';
import { CheckList } from 'components/checkList/checkList';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import {
	currencies,
	type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import type { TierBenefits, TierPlanCosts } from '../setup/threeTierConfig';
import { ThreeTierLozenge } from './threeTierLozenge';

interface ThreeTierCardProps {
	cardTier: 1 | 2 | 3;
	promoCount: number;
	title: string;
	isRecommended: boolean;
	isRecommendedSubdued: boolean;
	isUserSelected: boolean;
	benefits: TierBenefits;
	planCost: TierPlanCosts;
	currencyId: IsoCurrency;
	paymentFrequency: RegularContributionType;
	linkCtaClickHandler: (
		price: number,
		cardTier: 1 | 2 | 3,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => void;
	externalBtnLink: string;
}

const container = (
	isRecommended: boolean,
	isUserSelected: boolean,
	subdueHighlight: boolean,
) => {
	let cardOrder = 2;
	if (isRecommended) {
		cardOrder = 1;
	} else if (isUserSelected) {
		cardOrder = 0;
	}
	return css`
		position: ${isRecommended || isUserSelected ? 'relative' : 'static'};
		background-color: ${(isRecommended && !subdueHighlight) || isUserSelected
			? '#F1FBFF'
			: palette.neutral[100]};
		border-radius: ${space[3]}px;
		padding: 32px ${space[3]}px ${space[6]}px ${space[3]}px;
		${until.desktop} {
			order: ${cardOrder};
			padding-top: ${space[6]}px;
			margin-top: ${isRecommended && subdueHighlight ? '15px' : '0'};
		}
	`;
};

const titleCss = css`
	${textSans.small({ fontWeight: 'bold' })};
	color: #606060;
`;

const priceCss = (hasDiscountSummary: boolean) => css`
	${textSans.xlarge({ fontWeight: 'bold' })};
	position: relative;
	margin-bottom: ${hasDiscountSummary ? '0' : `${space[4]}px`};
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

const checkmarkList = css`
	width: 100%;
	text-align: left;
	${from.desktop} {
		width: 90%;
	}
`;

const benefitsPrefixCss = css`
	${textSans.small()};
	color: ${palette.neutral[7]};
	text-align: left;
	strong {
		font-weight: bold;
	}
`;

const benefitsPrefixPlus = css`
	${textSans.small()};
	color: ${palette.neutral[7]};
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
	currency: string,
	planCost: TierPlanCosts,
	promoCount: number,
) => {
	/* EXAMPLE:
  £6.5/month for 6 months, then £10/month
  £173/year for the first year, then £275/year
  */
	if (planCost.discount) {
		const period = planCost.discount.duration.period;
		const duration = planCost.discount.duration.value;
		const singleYear =
			period === 'ANNUAL' && duration === 1 ? ' the first ' : '';
		const promoPrice = planCost.discount.price;
		const promoPriceRounded =
			promoPrice % 1 === 0 ? promoPrice : promoPrice.toFixed(2);

		return `${currency}${promoPriceRounded}/${
			recurringContributionPeriodMap[planCost.discount.duration.period]
		} for ${duration > 1 ? duration : singleYear} ${
			recurringContributionPeriodMap[period]
		}${duration > 1 ? 's' : ''}, then ${currency}${planCost.price}/${
			recurringContributionPeriodMap[planCost.discount.duration.period]
		}${'*'.repeat(promoCount)}`;
	}
};

export function ThreeTierCard({
	cardTier,
	promoCount,
	title,
	planCost,
	isRecommended,
	isRecommendedSubdued,
	isUserSelected,
	benefits,
	currencyId,
	paymentFrequency,
	linkCtaClickHandler,
	externalBtnLink,
}: ThreeTierCardProps): JSX.Element {
	const currency = currencies[currencyId].glyph;
	const price = planCost.price;
	const priceCopy = !!planCost.discount && `${currency}${price}`;
	const promoPrice = planCost.discount?.price ?? planCost.price;
	const promoPriceRounded =
		promoPrice % 1 === 0 ? promoPrice : promoPrice.toFixed(2);
	const promoPriceCopy = `${currency}${promoPriceRounded}/${recurringContributionPeriodMap[paymentFrequency]}`;
	const quantumMetricButtonRef = `tier-${cardTier}-button`;
	return (
		<section
			css={container(isRecommended, isUserSelected, isRecommendedSubdued)}
		>
			{isUserSelected && <ThreeTierLozenge title="Your selection" />}
			{isRecommended && !isUserSelected && (
				<ThreeTierLozenge subdue={isRecommendedSubdued} title="Recommended" />
			)}
			<h2 css={titleCss}>{title}</h2>
			<p css={priceCss(!!planCost.discount)}>
				<span css={previousPriceStrikeThrough}>{priceCopy}</span>
				{priceCopy && ' '}
				{promoPriceCopy}
				{!!planCost.discount && (
					<span css={discountSummaryCss}>
						{discountSummaryCopy(currency, planCost, promoCount)}
					</span>
				)}
			</p>
			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
				<LinkButton
					href={externalBtnLink}
					cssOverrides={btnStyleOverrides}
					onClick={() => {
						linkCtaClickHandler(price, cardTier, paymentFrequency, currencyId);
					}}
					data-qm-trackable={quantumMetricButtonRef}
				>
					Subscribe
				</LinkButton>
			</ThemeProvider>

			{benefits.description && (
				<div css={benefitsPrefixCss}>
					<span>
						{benefits.description.map((stringPart) => {
							if (typeof stringPart === 'string') {
								return stringPart;
							} else {
								return <strong>{stringPart.copy}</strong>;
							}
						})}
					</span>
					<span css={benefitsPrefixPlus}>plus</span>
				</div>
			)}
			<CheckList
				checkListData={benefits.list.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
						strong: benefit.strong,
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkList}
			/>
		</section>
	);
}
