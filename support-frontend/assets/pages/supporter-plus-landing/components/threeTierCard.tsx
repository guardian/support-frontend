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
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { Currency } from 'helpers/internationalisation/currency';
import {
	currencies,
	type IsoCurrency,
} from 'helpers/internationalisation/currency';
import type { ProductDescription } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import { ThreeTierLozenge } from './threeTierLozenge';

type ThreeTierCardProps = {
	cardTier: 1 | 2 | 3;
	promoCount: number;
	isRecommended: boolean;
	isRecommendedSubdued: boolean;
	isUserSelected: boolean;
	currencyId: IsoCurrency;
	paymentFrequency: RegularContributionType;
	linkCtaClickHandler: (
		event: React.MouseEvent<HTMLAnchorElement>,
		link: string,
		price: number,
		cardTier: 1 | 2 | 3,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => void;
	link: string;
	productDescription: ProductDescription;
	price: number;
	promotion?: Promotion;
};

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

const priceCss = (hasPromotion: boolean) => css`
	${textSans.xlarge({ fontWeight: 'bold' })};
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

const offerLimitedTimeCss = css`
	color: #606060;
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
	currency: Currency,
	promoCount: number,
	price: number,
	promotion: Promotion,
	paymentFrequency: RegularContributionType,
) => {
	/**
	 * EXAMPLE:
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
		period === 'year' ? ' the first ' : ''
	} ${duration > 1 ? duration : ''} ${period}${
		duration > 1 ? 's' : ''
	}, then ${formattedPrice}/${period}${'*'.repeat(promoCount)}`;
};

export function ThreeTierCard({
	cardTier,
	promoCount,
	isRecommended,
	isRecommendedSubdued,
	isUserSelected,
	currencyId,
	paymentFrequency,
	linkCtaClickHandler,
	link,
	productDescription,
	price,
	promotion,
}: ThreeTierCardProps): JSX.Element {
	const currency = currencies[currencyId];
	const period = recurringContributionPeriodMap[paymentFrequency];
	const formattedPrice = simpleFormatAmount(currency, price);
	const quantumMetricButtonRef = `tier-${cardTier}-button`;
	const { label, benefits, benefitsSummary, offers, offersSummary } =
		productDescription;

	return (
		<section
			css={container(isRecommended, isUserSelected, isRecommendedSubdued)}
		>
			{isUserSelected && <ThreeTierLozenge title="Your selection" />}
			{isRecommended && !isUserSelected && (
				<ThreeTierLozenge subdue={isRecommendedSubdued} title="Recommended" />
			)}
			<h2 css={titleCss}>{label}</h2>
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
					onClick={(event) => {
						linkCtaClickHandler(
							event,
							link,
							price,
							cardTier,
							paymentFrequency,
							currencyId,
						);
					}}
					data-qm-trackable={quantumMetricButtonRef}
				>
					Subscribe
				</LinkButton>
			</ThemeProvider>

			{benefitsSummary && (
				<div css={benefitsPrefixCss}>
					<span>
						{benefitsSummary.map((stringPart) => {
							if (typeof stringPart !== 'string') {
								return <strong>{stringPart.copy}</strong>;
							} else {
								return stringPart;
							}
						})}
					</span>
				</div>
			)}
			{offersSummary && (
				<div css={benefitsPrefixCss}>
					<span>
						{offersSummary.map((stringPart) => {
							if (typeof stringPart !== 'string') {
								return <strong>{stringPart.copy}</strong>;
							} else {
								return stringPart;
							}
						})}
					</span>
				</div>
			)}
			{(benefitsSummary || offersSummary) && (
				<span css={benefitsPrefixPlus}>plus</span>
			)}
			<CheckList
				checkListData={benefits.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkList}
			/>
			{offers && offers.length > 0 && (
				<>
					<span css={[benefitsPrefixPlus, offerLimitedTimeCss]}>
						limited-time offer
					</span>
					<CheckList
						checkListData={offers.map((offer) => {
							return {
								text: offer.copy,
								isChecked: true,
								toolTip: offer.tooltip,
							};
						})}
						style={'compact'}
						iconColor={palette.brand[500]}
						cssOverrides={checkmarkList}
					/>
				</>
			)}
		</section>
	);
}
