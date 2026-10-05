import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import { guardianWeeklyTermsLink } from 'helpers/legal';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import { promotionTermsUrl } from 'helpers/urls/routes';
import type { GuardianWeeklyProductKey } from 'pages/weekly-subscription-landing/helpers/getWeeklyProducts';
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
	promotions: PromoWithCatalogInformation[],
	productKey: GuardianWeeklyProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
): string | undefined => {
	const promotion = getAppliedPromotion(
		promotions,
		productKey,
		ratePlanKey,
		promoCode,
	);
	return promotion ? promotionTermsUrl(promotion.promoCode) : undefined;
};

function MaybeLink({ href, text }: { text: string; href?: string }) {
	return href ? <a href={href}>{text}</a> : null;
}

type LinkTypes = {
	promotions: PromoWithCatalogInformation[];
	productKey: GuardianWeeklyProductKey;
	promoCode?: string;
};

function GiftLinks({ promotions, productKey, promoCode }: LinkTypes) {
	const annualUrl = getPromoUrl(
		promotions,
		productKey,
		'OneYearGift',
		promoCode,
	);
	const quarterlyUrl = getPromoUrl(
		promotions,
		productKey,
		'ThreeMonthGift',
		promoCode,
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

function PromoTerms(): JSX.Element | null {
	const { promoTerms } = usePromoTerms();

	if (!promoTerms) {
		return null;
	}

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
	promotions,
	productKey,
	promoCode,
	orderIsAGift,
}: {
	promotions: PromoWithCatalogInformation[];
	productKey: GuardianWeeklyProductKey;
	promoCode?: string;
	orderIsAGift: boolean;
}) {
	return (
		<Footer termsConditionsLink={guardianWeeklyTermsLink} fullWidth>
			{orderIsAGift ? (
				<GiftLinks
					promotions={promotions}
					productKey={productKey}
					promoCode={promoCode}
				/>
			) : (
				<PromoTerms />
			)}
		</Footer>
	);
}

export { GuardianWeeklyFooter };
