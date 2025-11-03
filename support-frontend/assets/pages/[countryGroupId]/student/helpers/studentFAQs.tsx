import type {
	CountryGroupId,
	SupportRegionId,
} from '@modules/internationalisation/countryGroup';
import { getFeatureFlags } from 'helpers/featureFlags';
import { privacyLink, supporterPlusTermsLink } from 'helpers/legal';
import { getProductLabel } from 'helpers/productCatalog';
import { helpCentreUrl } from 'helpers/urls/externalLinks';
import type { FAQItem } from 'pages/[countryGroupId]/components/accordionFAQ';
import { getSupportRegionIdConfig } from '../../../supportRegionConfig';

const supporterPlusLabel = getProductLabel('SupporterPlus', getFeatureFlags());
const supporterPlusBodyAccess: JSX.Element = (
	<p>
		You can access your {supporterPlusLabel} subscription across all devices by
		logging into your Guardian account.
	</p>
);

const supporterPlusBodyManage: JSX.Element = (
	<p>
		To manage your subscription, go to Manage my account, and for further
		information on your {supporterPlusLabel} subscription, see our{' '}
		<a href={supporterPlusTermsLink}>Terms & Conditions</a>.
	</p>
);

const supporterPlusBodyContact: JSX.Element = (
	<p>
		For any queries, including subscription-related queries, visit our{' '}
		<a href={helpCentreUrl}>Help centre</a>.
	</p>
);

const otherSupporterPlusFAQ: (regionName: string) => FAQItem[] = (
	regionName,
) => [
	{
		title: 'Who is eligible for this discount?',
		body: (
			<p>
				You must be 18+ and a verified fulltime student in {regionName}. You
				will need a valid Student Beans account to complete the verification and
				access this offer.
			</p>
		),
	},
	{
		title: `Will my ${supporterPlusLabel} subscription work across all devices?`,
		body: supporterPlusBodyAccess,
	},
	{
		title: `How can I manage my ${supporterPlusLabel} subscription?`,
		body: supporterPlusBodyManage,
	},
	{
		title: 'How do I contact customer services?',
		body: supporterPlusBodyContact,
	},
];

const auSupporterPlusFAQ: (regionName: string) => FAQItem[] = () => [
	{
		title: 'Who is eligible for this discount?',
		body: (
			<p>
				Access to the {supporterPlusLabel} subscription offered under this
				agreement is strictly limited to currently enrolled students of the
				University of Technology Sydney (UTS). Redemption of the offer is
				conditional upon registration using a valid and active UTS email
				address. Your email address may be subjected to an internal verification
				process to confirm your eligibility as a UTS student &mdash; you may
				refer to the Guardian&apos;s <a href={privacyLink}>privacy policy</a>{' '}
				which explains how personal information is handled by the Guardian. The
				Guardian reserves the right to cancel, suspend, or revoke any
				subscription claimed through this offer if it is reasonably suspected or
				determined that the subscriber does not meet the eligibility criteria.
			</p>
		),
	},
	{
		title: `What is included in my ${supporterPlusLabel} subscription?`,
		body: (
			<p>
				Your {supporterPlusLabel} subscription entitles you to all the benefits
				listed above, including: unlimited access to the Guardian news app and
				Guardian Feast app, ad-free reading on all your devices, exclusive
				newsletter for supporters and far fewer asks for support. Currently,
				this offer provides you with a free {supporterPlusLabel} subscription
				for a period of 24 months after redemption. We will be in touch during
				this period if there are opportunities to extend beyond this timeframe.
			</p>
		),
	},
	{
		title: `Will my ${supporterPlusLabel} subscription work across all devices?`,
		body: supporterPlusBodyAccess,
	},
	{
		title: `How can I manage my ${supporterPlusLabel} subscription?`,
		body: supporterPlusBodyManage,
	},
	{
		title: 'How do I contact customer services?',
		body: supporterPlusBodyContact,
	},
];

interface StudentFAQsConfig {
	getCopy: (regionName: string) => FAQItem[];
	regionName: string;
}

const studentFAQsConfig: Partial<Record<CountryGroupId, StudentFAQsConfig>> = {
	GBPCountries: {
		getCopy: otherSupporterPlusFAQ,
		regionName: 'the UK',
	},
	UnitedStates: {
		getCopy: otherSupporterPlusFAQ,
		regionName: 'the USA',
	},
	Canada: {
		getCopy: otherSupporterPlusFAQ,
		regionName: 'Canada',
	},
	AUDCountries: {
		getCopy: auSupporterPlusFAQ,
		// Not actually used
		regionName: 'Australia',
	},
};

export function getStudentFAQs(
	supportRegionId: SupportRegionId,
): FAQItem[] | undefined {
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);
	const faqConfig = studentFAQsConfig[countryGroupId];

	if (faqConfig) {
		return faqConfig.getCopy(faqConfig.regionName);
	}

	return undefined;
}
