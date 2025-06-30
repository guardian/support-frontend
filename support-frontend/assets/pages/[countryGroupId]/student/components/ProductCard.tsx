import { css } from '@emotion/react';
import {
	from,
	neutral,
	news,
	palette,
	space,
	textSans12,
	textSans17,
	textSansBold15,
	textSansBold17,
	textSansBold20,
	textSansBold24,
	textSansBold28,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { LandingPageProductDescription } from 'helpers/globalsAndSwitches/landingPageSettings';
import { currencies } from 'helpers/internationalisation/currency';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { discountSummaryCopy } from 'pages/supporter-plus-landing/components/threeTierCard';

export type CardContent = LandingPageProductDescription & {
	isUserSelected: boolean;
	link: string;
	price: number;
	promotion?: Promotion;
	product: 'TierThree' | 'SupporterPlus' | 'Contribution';
};

export type ThreeTierCardProps = {
	cardContent: CardContent;
	cardTier: 1 | 2 | 3;
	promoCount: number;
	isSubdued: boolean;
	currencyId: IsoCurrency;
	billingPeriod: BillingPeriod;
};

const container = css`
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: ${space[6]}px ${space[4]}px ${space[5]}px;
	position: relative;
`;

const heading = css`
	${textSansBold20}
	color: ${neutral[7]};

	${from.tablet} {
		${textSansBold24}
	}
`;

const promotionCss = css`
	${textSansBold28};
	small {
		${textSansBold17};
	}
`;

const discountSummaryCss = css`
	${textSans12}
	color: ${neutral[20]}px;
	text-align: center;
`;

const originalPriceStrikeThrough = css`
	${textSans17}
	color: ${neutral[46]};
	text-decoration: line-through;
	margin-left: ${space[2]}px;
`;

const btnStyleOverrides = css`
	width: 100%;
	margin-bottom: ${space[2]}px;
`;

const benefitsListCSS = css`
	width: 100%;
	text-align: left;
	border-top: 1px solid ${neutral[73]};
	margin-top: ${space[6]}px;
	padding-top: ${space[2]}px;
	${from.desktop} {
		width: 90%;
	}
`;

const pill = css`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
	padding: ${space[1]}px ${space[4]}px;
	border-radius: ${space[1]}px;
	background-color: ${news[400]};
	color: ${palette.neutral[100]};
	${textSansBold15};
`;

const headWrapper = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: ${space[6]}px;
`;

export default function ProductCard({
	cardContent,
	promoCount,
	currencyId,
	billingPeriod,
}: ThreeTierCardProps) {
	const { title, benefits, promotion, price, link, cta, product } = cardContent;
	console.log('🚀 ~ promotion:', promotion);
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
						hideBullet: benefits.length <= 1 && product !== 'TierThree',
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={benefitsListCSS}
			/>
		</section>
	);
}
