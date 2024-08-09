// ----- Imports ----- //
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { SubscriptionProduct } from './productPrice/subscriptions';
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
// TBD update these before or early in the moment launch
const defaultPhilanthropyContactEmail = 'us.philanthropy@theguardian.com';
const philanthropyContactEmail: Record<CountryGroupId, string> = {
	GBPCountries: defaultPhilanthropyContactEmail,
	UnitedStates: defaultPhilanthropyContactEmail,
	AUDCountries: 'australia.philanthropy@theguardian.com',
	EURCountries: defaultPhilanthropyContactEmail,
	International: defaultPhilanthropyContactEmail,
	NZDCountries: defaultPhilanthropyContactEmail,
	Canada: defaultPhilanthropyContactEmail,
};
const subscriptionsTermsLinks: Record<SubscriptionProduct, string> = {
	DigitalPack:
		'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions',
	PremiumTier:
		'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions',
	DailyEdition:
		'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions',
	GuardianWeekly:
		'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions',
	Paper:
		'https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions',
	PaperAndDigital:
		'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions',
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
const tier3TermsLink =
	'https://www.theguardian.com/info/article/2024/jul/19/digital-print-terms-and-conditions';
// ----- Exports ----- //
export {
	contributionsTermsLinks,
	subscriptionsTermsLinks,
	privacyLink,
	copyrightNotice,
	contributionsEmail,
	philanthropyContactEmail,
	guardianLiveTermsLink,
	supporterPlusTermsLink,
	tier3TermsLink,
};
