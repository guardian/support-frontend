import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
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
import { textLink } from '../../../helpers/utilities/textLink';

const marginTop = css`
	margin-top: ${space[1]}px;
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
				return textLink('Terms', guardianAdLiteTermsLink);
			case 'DigitalSubscription':
				return textLink('Terms and Conditions', digitalPlusTermsLink);
			case 'SupporterPlus':
				return textLink('Terms and Conditions', supporterPlusTermsLink);
			case 'TierThree':
				return textLink('Terms', tierThreeTermsLink);
			case 'HomeDelivery':
			case 'NationalDelivery':
			case 'SubscriptionCard':
				return textLink('Terms & Conditions', paperTermsLink);
			case 'GuardianWeeklyDomestic':
			case 'GuardianWeeklyRestOfWorld':
				return textLink('Terms & Conditions', guardianWeeklyTermsLink);
			default:
				return textLink(
					'Terms and Conditions',
					contributionsTermsLinks[countryGroupId],
				);
		}
	};

	const weeklyGiftTerms = (
		<>
			To cancel, go to {textLink('Manage My Account', manageAccountLink)} or see
			our {textLink('Terms', guardianWeeklyTermsLink)}. This subscription does
			not auto-renew.
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
