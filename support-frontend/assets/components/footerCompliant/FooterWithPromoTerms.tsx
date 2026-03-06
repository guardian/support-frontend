import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Domestic } from '@modules/product/fulfilmentOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import type { ReactNode } from 'react';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import { guardianWeeklyTermsLink } from 'helpers/legal';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import { promotionTermsUrl } from 'helpers/urls/routes';
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

function MaybeLink({ href, text }: { text: string; href?: string }) {
	return href ? <a href={href}>{text}</a> : null;
}

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
					<MaybeLink href={monthlyUrl} text="monthly" />
					{multipleOffers ? ' and ' : ''}
					<MaybeLink href={annualUrl} text="annual" />
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
					<MaybeLink href={quarterlyUrl} text="quarterly" />
					{multipleOffers ? ' and ' : ''}
					<MaybeLink href={annualUrl} text="annual" />
					&nbsp;offer{multipleOffers ? 's' : ''}
				</span>
			</PromoTerms>
		);
	}
	return null;
}

function PromoTerms({
	children,
	enableWeeklyDigital,
}: {
	children: ReactNode;
	enableWeeklyDigital: boolean;
}) {
	const { promoTerms } = usePromoTerms();
	const defaultPromoTerms = (
		<>
			Offer subject to availability. Guardian News and Media Ltd ("GNM")
			reserves the right to withdraw this promotion at any time. Full promotion
			terms and conditions for our {children}.
		</>
	);

	return (
		<span css={weeklyFooter(enableWeeklyDigital)}>
			<h3 id="qa-component-customer-service" css={footerTextHeading}>
				Promotion terms and conditions
			</h3>
			<p css={promoOfferLink}>
				{enableWeeklyDigital && promoTerms ? promoTerms : defaultPromoTerms}
			</p>
		</span>
	);
}

function GuardianWeeklyFooter({
	productPrices,
	orderIsAGift,
	country,
	enableWeeklyDigital,
}: {
	productPrices: ProductPrices;
	country: IsoCountry;
	orderIsAGift: boolean;
	promotion?: Promotion | null;
	enableWeeklyDigital: boolean;
}) {
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
