import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Domestic } from '@modules/product/fulfilmentOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import { guardianWeeklyTermsLink } from 'helpers/legal';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { promotionTermsUrl } from 'helpers/urls/routes';
import Footer from './Footer';
import { footerTextHeading } from './footerStyles';

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
};

function GiftLinks({ productPrices, country, fulfillmentOption }: LinkTypes) {
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
			<section>
				<p id="qa-component-customer-service" css={footerTextHeading}>
					Promotion terms and conditions
				</p>
				<p>
					Offer subject to availability. Guardian News and Media Ltd ("GNM")
					reserves the right to withdraw this promotion at any time. Full
					promotion terms and conditions for our{' '}
					<MaybeLink href={quarterlyUrl} text="quarterly" />
					{multipleOffers ? ' and ' : ''}
					<MaybeLink href={annualUrl} text="annual" />
					&nbsp;offer{multipleOffers ? 's' : ''}.
				</p>
			</section>
		);
	}

	return null;
}

function PromoTerms() {
	const { promoTerms } = usePromoTerms();

	return (
		<section>
			<p id="qa-component-customer-service" css={footerTextHeading}>
				Promotion terms and conditions
			</p>
			<p css={promoOfferLink}>{promoTerms}</p>
		</section>
	);
}

function GuardianWeeklyFooter({
	productPrices,
	orderIsAGift,
	country,
}: {
	productPrices: ProductPrices;
	country: IsoCountry;
	orderIsAGift: boolean;
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
				/>
			) : (
				<PromoTerms />
			)}
		</Footer>
	);
}

export { GuardianWeeklyFooter };
