import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
// ----- Imports ----- //
// ----- Terms & Conditions ----- //
const privacyLink = 'https://www.theguardian.com/help/privacy-policy';
const guardianHelpCentreLink = 'https://www.theguardian.com/help';
const guardianContactUsLink = 'https://www.theguardian.com/help/contact-us';
const defaultContributionEmail = 'mailto:contribution.support@theguardian.com';
const copyrightNotice = `\u00A9 ${new Date().getFullYear()} Guardian News and Media Limited or its
  affiliated companies. All rights reserved.`;
const contributionsEmail: Record<SupportRegionId, string> = {
	au: 'mailto:apac.help@theguardian.com',
	uk: defaultContributionEmail,
	us: defaultContributionEmail,
	eu: defaultContributionEmail,
	int: defaultContributionEmail,
	nz: defaultContributionEmail,
	ca: defaultContributionEmail,
};
const defaultContributionTermsLink =
	'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions';
const contributionsTermsLinks: Record<SupportRegionId, string> = {
	uk: defaultContributionTermsLink,
	us: 'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
	au: 'https://www.theguardian.com/info/2016/apr/08/australia-contribution-terms-and-conditions',
	eu: defaultContributionTermsLink,
	int: defaultContributionTermsLink,
	nz: defaultContributionTermsLink,
	ca: defaultContributionTermsLink,
};
const guardianLiveTermsLink =
	'https://www.theguardian.com/info/2014/sep/09/guardian-live-events-terms-and-conditions';
const supporterPlusTermsLink =
	'https://www.theguardian.com/info/2025/oct/31/guardian-subscription-terms-and-conditions';
const guardianAdLiteTermsLink = `https://www.theguardian.com/guardian-ad-lite-tcs`;
const paperTermsLink =
	'https://www.theguardian.com/info/2021/aug/04/guardian-and-observer-voucher-subscription-card-and-home-delivery-subscription-services-terms-and-conditions';
const digitalPlusTermsLink =
	'https://www.theguardian.com/info/2025/oct/31/guardian-subscription-terms-and-conditions';
const guardianWeeklyTermsLink =
	'https://www.theguardian.com/info/2026/mar/10/guardian-weekly-subscription-terms-and-conditions';
const manageAccountLink = 'https://manage.theguardian.com';
const observerLinks = {
	TERMS: 'https://observer.co.uk/policy/terms',
	PRIVACY: 'https://observer.co.uk/policy/privacy',
};
enum MediaGroup {
	GUARDIAN = 'Guardian News & Media Ltd',
	TORTOISE = 'GC re Tortoise Media Ltd t/a The Observer',
}

export {
	guardianContactUsLink,
	guardianHelpCentreLink,
	defaultContributionEmail,
	contributionsTermsLinks,
	privacyLink,
	copyrightNotice,
	contributionsEmail,
	guardianLiveTermsLink,
	supporterPlusTermsLink,
	guardianAdLiteTermsLink,
	paperTermsLink,
	digitalPlusTermsLink,
	guardianWeeklyTermsLink,
	observerLinks,
	manageAccountLink,
	MediaGroup,
};
