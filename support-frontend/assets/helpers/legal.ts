import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

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

export {
	contributionsTermsLinks,
	privacyLink,
	copyrightNotice,
	contributionsEmail,
};
