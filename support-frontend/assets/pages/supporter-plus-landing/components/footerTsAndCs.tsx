import { css } from '@emotion/react';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { StripeDisclaimer } from 'components/stripe/stripeDisclaimer';
import {
	contributionsTermsLinks,
	digitalPlusTermsLink,
	guardianAdLiteTermsLink,
	guardianWeeklyTermsLink,
	manageAccountLink,
	paperTermsLink,
	privacyLink,
	supporterPlusTermsLink,
	tierThreeTermsLink,
} from 'helpers/legal';
import { getProductLabel } from 'helpers/productCatalog';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import { termsLink } from './termsLink';

const marginTop = css`
	margin-top: 4px;
`;

interface FooterTsAndCsProps {
	productKey: ActiveProductKey;
	countryGroupId: CountryGroupId;
	ratePlanKey?: ActiveRatePlanKey;
}
export function FooterTsAndCs({
	productKey,
	countryGroupId,
	ratePlanKey,
}: FooterTsAndCsProps) {
	const privacy = <a href={privacyLink}>Privacy Policy</a>;
	const getProductNameSummary = (): string => {
		switch (productKey) {
			case 'GuardianAdLite':
				return `the ${getProductLabel(productKey)}`;
			case 'TierThree':
				return getProductLabel(productKey);
			default:
				return 'our';
		}
	};
	const getProductTerms = (): JSX.Element => {
		switch (productKey) {
			case 'GuardianAdLite':
				return termsLink('Terms', guardianAdLiteTermsLink);
			case 'DigitalSubscription':
				return termsLink('Terms and Conditions', digitalPlusTermsLink);
			case 'SupporterPlus':
				return termsLink('Terms and Conditions', supporterPlusTermsLink);
			case 'TierThree':
				return termsLink('Terms', tierThreeTermsLink);
			case 'HomeDelivery':
			case 'NationalDelivery':
			case 'SubscriptionCard':
				return termsLink('Terms & Conditions', paperTermsLink);
			case 'GuardianWeeklyDomestic':
			case 'GuardianWeeklyRestOfWorld':
				return termsLink('Terms & Conditions', guardianWeeklyTermsLink);
			default:
				return termsLink(
					'Terms and Conditions',
					contributionsTermsLinks[countryGroupId],
				);
		}
	};

	const weeklyGiftTerms = (
		<>
			To cancel, go to {termsLink('Manage My Account', manageAccountLink)} or
			see our {termsLink('Terms', guardianWeeklyTermsLink)}. This subscription
			does not auto-renew.
		</>
	);
	const isWeeklyGift =
		ratePlanKey && isGuardianWeeklyGiftProduct(productKey, ratePlanKey);
	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to {getProductNameSummary()}{' '}
			{getProductTerms()}. {isWeeklyGift && weeklyGiftTerms}
			<p css={marginTop}>
				To find out what personal data we collect and how we use it, please
				visit our {privacy}.
			</p>
			<p css={marginTop}>
				<StripeDisclaimer />
			</p>
		</div>
	);
}
