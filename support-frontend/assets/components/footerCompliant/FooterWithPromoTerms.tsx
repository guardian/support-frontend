import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Domestic } from '@modules/product/fulfilmentOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import type { ReactNode } from 'react';
import { guardianWeeklyTermsLink } from 'helpers/legal';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { promotionTermsUrl } from 'helpers/urls/routes';
import { weeklyTermsAndConditionsLink } from 'pages/weekly-subscription-landing/components/weeklyPriceInfo';
import Footer from './Footer';
import { footerTextHeading } from './footerStyles';

const weeklyFooter = (enableWeeklyDigital: boolean) => {
	return enableWeeklyDigital
		? undefined
		: css`
				p {
					margin-top: ${space[3]}px;
				}
		  `;
};
const promoOfferLink = css`
	& a {
		:visited {
			color: ${neutral[100]};
		}
	}
`;

const getPromoUrl = (
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfillmentOption: FulfilmentOptions,
): string | undefined => {
	const promotion = getPromotion(
		productPrices,
		country,
		billingPeriod,
		fulfillmentOption,
		NoProductOptions,
	);
	return promotion ? promotionTermsUrl(promotion.promoCode) : undefined;
};

type LinkTypes = {
	productPrices: ProductPrices;
	country: IsoCountry;
	fulfillmentOption: FulfilmentOptions;
	enableWeeklyDigital: boolean;
};

function RegularLinks({
	productPrices,
	country,
	fulfillmentOption,
	enableWeeklyDigital,
}: LinkTypes) {
	const annualUrl = getPromoUrl(
		productPrices,
		country,
		BillingPeriod.Annual,
		fulfillmentOption,
	);
	const monthlyUrl = getPromoUrl(
		productPrices,
		country,
		BillingPeriod.Monthly,
		fulfillmentOption,
	);
	const multipleOffers = !!(annualUrl && monthlyUrl);
	if (annualUrl ?? monthlyUrl) {
		return (
			<PromoTerms enableWeeklyDigital={enableWeeklyDigital}>
				<span>
					{monthlyUrl ? <a href={monthlyUrl}>monthly</a> : null}
					{multipleOffers ? ' and ' : ''}
					{annualUrl ? <a href={annualUrl}>annual</a> : null}
					&nbsp;offer{multipleOffers ? 's' : ''}
				</span>
			</PromoTerms>
		);
	}
	return null;
}

function GiftLinks({
	productPrices,
	country,
	fulfillmentOption,
	enableWeeklyDigital,
}: LinkTypes) {
	const annualUrl = getPromoUrl(
		productPrices,
		country,
		BillingPeriod.Annual,
		fulfillmentOption,
	);
	const quarterlyUrl = getPromoUrl(
		productPrices,
		country,
		BillingPeriod.Quarterly,
		fulfillmentOption,
	);
	const multipleOffers = !!(annualUrl && quarterlyUrl);
	if (annualUrl ?? quarterlyUrl) {
		return (
			<PromoTerms enableWeeklyDigital={enableWeeklyDigital}>
				<span>
					{quarterlyUrl ? <a href={quarterlyUrl}>quarterly</a> : null}
					{multipleOffers ? ' and ' : ''}
					{annualUrl ? <a href={annualUrl}>annual</a> : null}
					&nbsp;offer{multipleOffers ? 's' : ''}
				</span>
			</PromoTerms>
		);
	}
	return null;
}

interface PromoTermsProps {
	children: ReactNode;
	enableWeeklyDigital: boolean;
}
function PromoTerms({ children, enableWeeklyDigital }: PromoTermsProps) {
	const termsAndConditionsLink = enableWeeklyDigital
		? weeklyTermsAndConditionsLink()
		: 'promotion terms and conditions';
	return (
		<span css={weeklyFooter(enableWeeklyDigital)}>
			<h3 id="qa-component-customer-service" css={footerTextHeading}>
				Promotion terms and conditions
			</h3>
			<p css={promoOfferLink}>
				Offer subject to availability. Guardian News and Media Ltd
				(&quot;GNM&quot;) reserves the right to withdraw this promotion at any
				time. Full {termsAndConditionsLink} for our&nbsp;
				{children}.
			</p>
		</span>
	);
}

type FooterWithPromoTermsProps = {
	productPrices: ProductPrices;
	country: IsoCountry;
	orderIsAGift: boolean;
	enableWeeklyDigital: boolean;
};
function GuardianWeeklyFooter({
	productPrices,
	orderIsAGift,
	country,
	enableWeeklyDigital,
}: FooterWithPromoTermsProps): JSX.Element {
	const weeklyFulfillmentOption = Domestic;
	return (
		<Footer termsConditionsLink={guardianWeeklyTermsLink} fullWidth>
			{orderIsAGift ? (
				<GiftLinks
					productPrices={productPrices}
					country={country}
					fulfillmentOption={weeklyFulfillmentOption}
					enableWeeklyDigital={enableWeeklyDigital}
				/>
			) : (
				<RegularLinks
					productPrices={productPrices}
					country={country}
					fulfillmentOption={weeklyFulfillmentOption}
					enableWeeklyDigital={enableWeeklyDigital}
				/>
			)}
		</Footer>
	);
}

export { GuardianWeeklyFooter };
