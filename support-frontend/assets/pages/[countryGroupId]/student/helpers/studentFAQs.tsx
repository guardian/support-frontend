import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { privacyLink, supporterPlusTermsLink } from 'helpers/legal';
import { helpCentreUrl } from 'helpers/urls/externalLinks';
import type { FAQItem } from 'pages/[countryGroupId]/components/accordionFAQ';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

const supporterPlusBodyAccess: JSX.Element = (
	<p>
		You can access your All- access digital subscription across all devices by
		logging into your Guardian account.
	</p>
);
const supporterPlusBodyManage: JSX.Element = (
	<p>
		To manage your subscription, go to Manage my account, and for further
		information on your All-access digital subscription, see our{' '}
		<a href={supporterPlusTermsLink}>Terms & Conditions</a>
	</p>
);
const supporterPlusBodyContact: JSX.Element = (
	<p>
		For any queries, including subscription-related queries, visit our{' '}
		<a href={helpCentreUrl}>Help centre</a>
	</p>
);
const otherSupporterPlusFAQ: FAQItem[] = [
	{
		title: 'Who is eligible for this discount?',
		body: (
			<p>
				Current students at [university/college] who register and verify through
				Student Beans, are eligible for this discount.
			</p>
		),
	},
	{
		title: 'What is included in my All-access subscription?',
		body: (
			<p>
				Your All-access digital subscription entitles you to all the benefits
				listed above, including: unlimited access to the Guardian news app and
				Guardian Feast app, ad-free reading on all your devices, exclusive
				newsletter for supporters and far fewer asks for support.
			</p>
		),
	},
	{
		title: 'Will my All-access subscription work across all devices?',
		body: supporterPlusBodyAccess,
	},
	{
		title: 'How can I manage my All-access subscription?',
		body: supporterPlusBodyManage,
	},
	{
		title: 'How do I contact customer services?',
		body: supporterPlusBodyContact,
	},
];
const auSupporterPlusFAQ: FAQItem[] = [
	{
		title: 'Who is eligible for this discount?',
		body: (
			<p>
				Access to the All-access digital subscription offered under this
				agreement is strictly limited to currently enrolled students of the
				University of Technology Sydney (UTS). Redemption of the offer is
				conditional upon registration using a valid and active UTS email
				address. Your email address may be subjected to an internal verification
				process to confirm your eligibility as a UTS student – you may refer to
				the Guardian’s <a href={privacyLink}>privacy policy</a> which explains
				how personal information is handled by the Guardian. The Guardian
				reserves the right to cancel, suspend, or revoke any subscription
				claimed through this offer if it is reasonably suspected or determined
				that the subscriber does not meet the eligibility criteria.
			</p>
		),
	},
	{
		title: 'What is included in my All-access subscription?',
		body: (
			<p>
				Your All-access digital subscription entitles you to all the benefits
				listed above, including: unlimited access to the Guardian news app and
				Guardian Feast app, ad-free reading on all your devices, exclusive
				newsletter for supporters and far fewer asks for support. Currently,
				this offer provides you with a free All-access digital subscription for
				a period of 24 months after redemption. We will be in touch during this
				period if there are opportunities to extend beyond this timeframe.
			</p>
		),
	},
	{
		title: 'Will my All-access subscription work across all devices?',
		body: supporterPlusBodyAccess,
	},
	{
		title: 'How can I manage my All-access subscription?',
		body: supporterPlusBodyManage,
	},
	{
		title: 'How do I contact customer services?',
		body: supporterPlusBodyContact,
	},
];
const studentFAQs: Partial<Record<CountryGroupId, FAQItem[]>> = {
	GBPCountries: otherSupporterPlusFAQ,
	UnitedStates: otherSupporterPlusFAQ,
	Canada: otherSupporterPlusFAQ,
	AUDCountries: auSupporterPlusFAQ,
};

export function getStudentFAQs(geoId: GeoId): FAQItem[] | undefined {
	const { countryGroupId } = getGeoIdConfig(geoId);
	return studentFAQs[countryGroupId];
}
