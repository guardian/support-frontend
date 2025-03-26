// ----- Imports ----- //
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
// ----- Terms & Conditions ----- //
const defaultContributionTermsLink =
	'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions';
const contributionsTermsLinks: Record<CountryGroupId, string> = {
	GBPCountries: defaultContributionTermsLink,
	UnitedStates:
		'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
	AUDCountries:
		'https://www.theguardian.com/info/2016/apr/08/australia-contribution-terms-and-conditions',
	EURCountries: defaultContributionTermsLink,
	International: defaultContributionTermsLink,
	NZDCountries: defaultContributionTermsLink,
	Canada: defaultContributionTermsLink,
};
const privacyLink = 'https://www.theguardian.com/help/privacy-policy';
const defaultContributionEmail = 'mailto:contribution.support@theguardian.com';
const copyrightNotice = `\u00A9 ${new Date().getFullYear()} Guardian News and Media Limited or its
  affiliated companies. All rights reserved.`;
const contributionsEmail: Record<CountryGroupId, string> = {
	AUDCountries: 'mailto:apac.help@theguardian.com',
	GBPCountries: defaultContributionEmail,
	UnitedStates: defaultContributionEmail,
	EURCountries: defaultContributionEmail,
	International: defaultContributionEmail,
	NZDCountries: defaultContributionEmail,
	Canada: defaultContributionEmail,
};
const guardianLiveTermsLink =
	'https://www.theguardian.com/info/2014/sep/09/guardian-live-events-terms-and-conditions';
const supporterPlusTermsLink =
	'https://www.theguardian.com/info/2022/oct/28/the-guardian-supporter-plus-terms-and-conditions';
const tierThreeTermsLink =
	'https://www.theguardian.com/info/article/2024/jul/19/digital-print-terms-and-conditions';
const guardianAdLiteTermsLink = `https://www.theguardian.com/guardian-ad-lite-tcs`;
const paperTermsLink =
	'https://www.theguardian.com/info/2021/aug/04/guardian-and-observer-voucher-subscription-card-and-home-delivery-subscription-services-terms-and-conditions';
const digitalSubscriptionTermsLink =
	'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions';
// ----- Exports ----- //
export {
	contributionsTermsLinks,
	privacyLink,
	copyrightNotice,
	contributionsEmail,
	guardianLiveTermsLink,
	supporterPlusTermsLink,
	tierThreeTermsLink,
	guardianAdLiteTermsLink,
	paperTermsLink,
	digitalSubscriptionTermsLink,
};
