import { palette } from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type {
	ThreeTierCardProps} from 'pages/supporter-plus-landing/components/threeTierCard';
import {
	discountSummaryCopy
} from 'pages/supporter-plus-landing/components/threeTierCard';
import {
	benefitsListCSS,
	btnStyleOverrides,
	container,
	discountSummaryCss,
	heading,
	headWrapper,
	originalPriceStrikeThrough,
	pill,
	promotionCss,
} from './StudentProductCardStyles';

export default function StudentProductCard({
	cardContent,
	promoCount,
	currencyId,
	billingPeriod,
}: ThreeTierCardProps) {
	const { title, benefits, promotion, price, link, cta } = cardContent;
	const currency = currencies[currencyId];
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const originalPrice = simpleFormatAmount(currency, price);
	const promotionPrice =
		promotion?.discountedPrice &&
		simpleFormatAmount(currency, promotion.discountedPrice);

	return (
		<section css={container}>
			<div css={pill}>student offer</div>
			<div css={headWrapper}>
				<h2 css={heading}>{title}</h2>
				<p>
					<span css={promotionCss}>
						{promotion ? promotionPrice : originalPrice}
						<small>/{periodNoun}</small>
					</span>
					{promotion && (
						<span
							css={originalPriceStrikeThrough}
						>{`${originalPrice}/${periodNoun}`}</span>
					)}
				</p>
			</div>
			<LinkButton
				href={link}
				cssOverrides={btnStyleOverrides}
				aria-label={title}
				theme={themeButtonReaderRevenueBrand}
			>
				{cta.copy}
			</LinkButton>
			<p css={discountSummaryCss}>
				{promotion &&
					discountSummaryCopy(
						currency,
						promoCount,
						price,
						promotion,
						billingPeriod,
					)}
			</p>
			<BenefitsCheckList
				benefitsCheckListData={benefits.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
						pill: benefit.label?.copy,
						hideBullet: false,
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={benefitsListCSS}
			/>
		</section>
	);
}
