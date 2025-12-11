import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Domestic } from '@modules/product/fulfilmentOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import type { ReactNode } from 'react';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { Option } from 'helpers/types/option';
import { promotionTermsUrl } from 'helpers/urls/routes';
import Footer from './Footer';
import { footerTextHeading } from './footerStyles';

type FooterWithPromoTermsProps = {
	productPrices: ProductPrices;
	country: IsoCountry;
	orderIsAGift: boolean;
};

const getPromoUrl = (
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfillmentOption: FulfilmentOptions,
): Option<string> => {
	const promotion = getPromotion(
		productPrices,
		country,
		billingPeriod,
		fulfillmentOption,
		NoProductOptions,
	);
	return promotion ? promotionTermsUrl(promotion.promoCode) : null;
};

type LinkTypes = {
	productPrices: ProductPrices;
	country: IsoCountry;
	fulfillmentOption: FulfilmentOptions;
};

function MaybeLink(props: { href: Option<string>; text: string }) {
	return props.href ? <a href={props.href}>{props.text}</a> : null;
}

function RegularLinks(props: LinkTypes) {
	const annualUrl = getPromoUrl(
		props.productPrices,
		props.country,
		BillingPeriod.Annual,
		props.fulfillmentOption,
	);
	const monthlyUrl = getPromoUrl(
		props.productPrices,
		props.country,
		BillingPeriod.Monthly,
		props.fulfillmentOption,
	);
	const multipleOffers = !!(annualUrl && monthlyUrl);

	if (annualUrl ?? monthlyUrl) {
		return (
			<PromoTerms>
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

function GiftLinks(props: LinkTypes) {
	const annualUrl = getPromoUrl(
		props.productPrices,
		props.country,
		BillingPeriod.Annual,
		props.fulfillmentOption,
	);
	const quarterlyUrl = getPromoUrl(
		props.productPrices,
		props.country,
		BillingPeriod.Quarterly,
		props.fulfillmentOption,
	);
	const multipleOffers = !!(annualUrl && quarterlyUrl);
	if (annualUrl ?? quarterlyUrl) {
		return (
			<PromoTerms>
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

interface PromoTermsProps {
	children: ReactNode;
}
function PromoTerms({ children }: PromoTermsProps) {
	return (
		<>
			<h3 id="qa-component-customer-service" css={footerTextHeading}>
				Promotion terms and conditions
			</h3>
			<p>
				Offer subject to availability. Guardian News and Media Ltd
				(&quot;GNM&quot;) reserves the right to withdraw this promotion at any
				time. Full promotion terms and conditions for our&nbsp;
				{children}.
			</p>
		</>
	);
}

function FooterWithPromoTerms({
	productPrices,
	orderIsAGift,
	country,
	fulfillmentOption,
	termsConditionsLink,
}: FooterWithPromoTermsProps & {
	fulfillmentOption: FulfilmentOptions;
	termsConditionsLink: string;
}) {
	return (
		<Footer centred termsConditionsLink={termsConditionsLink} fullWidth>
			{orderIsAGift ? (
				<GiftLinks
					productPrices={productPrices}
					country={country}
					fulfillmentOption={fulfillmentOption}
				/>
			) : (
				<RegularLinks
					productPrices={productPrices}
					country={country}
					fulfillmentOption={fulfillmentOption}
				/>
			)}
		</Footer>
	);
}

function GuardianWeeklyFooter({
	productPrices,
	orderIsAGift,
	country,
}: FooterWithPromoTermsProps): JSX.Element {
	const termsConditionsLink =
		'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions';
	return (
		<FooterWithPromoTerms
			productPrices={productPrices}
			orderIsAGift={orderIsAGift}
			country={country}
			fulfillmentOption={Domestic}
			termsConditionsLink={termsConditionsLink}
		/>
	);
}

export { GuardianWeeklyFooter };
