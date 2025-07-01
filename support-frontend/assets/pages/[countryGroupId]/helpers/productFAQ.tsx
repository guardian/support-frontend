import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	guardianAdLiteTermsLink,
	privacyLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { helpCentreUrl } from 'helpers/urls/externalLinks';
import { rowSpacing } from '../components/accordianFAQStyles';

export type FAQ = Array<{
	title: string;
	body: JSX.Element;
}>;
const guardianAdLiteFAQ: Partial<Record<CountryGroupId, FAQ>> = {
	GBPCountries: [
		{
			title: 'What is included in my Guardian Ad-Lite subscription?',
			body: (
				<div>
					<p css={rowSpacing}>
						A Guardian Ad-Lite subscription enables you to read the Guardian
						website without personalised advertising. You will still see
						advertising but it will be delivered without the use of personalised
						advertising cookies or similar technologies.
					</p>
					<p css={rowSpacing}>
						A Guardian Ad-Lite subscription does not entitle you to the
						additional benefits on offer via our All-access digital and Digital
						+ print subscriptions, which are stated{' '}
						<a href="/contribute">here</a>.
					</p>
				</div>
			),
		},
		{
			title: 'Will my Guardian Ad-Lite subscription work across all devices?',
			body: (
				<div css={rowSpacing}>
					You can read the Guardian website without personalised advertising
					across all devices by logging into your Guardian account. Guardian
					Ad-Lite applies to our website only, and not the Guardian Live App.
				</div>
			),
		},
		{
			title: 'How do I cancel my Guardian Ad-Lite subscription?',
			body: (
				<div css={rowSpacing}>
					To cancel, go to Manage my account, and for further information on
					your Guardian Ad-Lite subscription, see{' '}
					<a href={guardianAdLiteTermsLink}>here</a>.
				</div>
			),
		},
		{
			title: 'How do I contact customer services?',
			body: (
				<div css={rowSpacing}>
					For any queries, including subscription-related queries, please visit
					our <a href={helpCentreUrl}>Help centre</a>, where you will also find
					contact details for your region.
				</div>
			),
		},
	],
};
const supporterPlusBodyAccess: JSX.Element = (
	<div css={rowSpacing}>
		You can access your All- access digital subscription across all devices by
		logging into your Guardian account.
	</div>
);
const supporterPlusBodyManage: JSX.Element = (
	<div css={rowSpacing}>
		To manage your subscription, go to Manage my account, and for further
		information on your All-access digital subscription, see our Terms &
		Conditions <a href={supporterPlusTermsLink}>here</a>
	</div>
);
const supporterPlusBodyContact: JSX.Element = (
	<div css={rowSpacing}>
		For any queries, including subscription-related queries, visit our{' '}
		<a href={helpCentreUrl}>Help centre</a>
	</div>
);
const otherSupporterPlusFAQ: FAQ = [
	{
		title: 'Who is eligible for this discount?',
		body: (
			<div css={rowSpacing}>
				Current students at [university/college] who register and verify through
				Student Beans, are eligible for this discount.
			</div>
		),
	},
	{
		title: 'What is included in my All-access subscription?',
		body: (
			<div css={rowSpacing}>
				Your All-access digital subscription entitles you to all the benefits
				listed above, including: unlimited access to the Guardian news app and
				Guardian Feast app, ad-free reading on all your devices, exclusive
				newsletter for supporters and far fewer asks for support.
			</div>
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
const auSupporterPlusFAQ: FAQ = [
	{
		title: 'Who is eligible for this discount?',
		body: (
			<div css={rowSpacing}>
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
			</div>
		),
	},
	{
		title: 'What is included in my All-access subscription?',
		body: (
			<div css={rowSpacing}>
				Your All-access digital subscription entitles you to all the benefits
				listed above, including: unlimited access to the Guardian news app and
				Guardian Feast app, ad-free reading on all your devices, exclusive
				newsletter for supporters and far fewer asks for support. Currently,
				this offer provides you with a free All-access digital subscription for
				a period of 24 months after redemption. We will be in touch during this
				period if there are opportunities to extend beyond this timeframe.
			</div>
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
const supporterPlusFAQ: Partial<Record<CountryGroupId, FAQ>> = {
	AUDCountries: auSupporterPlusFAQ,
	GBPCountries: otherSupporterPlusFAQ,
	UnitedStates: otherSupporterPlusFAQ,
};

export const productFAQ: Partial<
	Record<ActiveProductKey, Partial<Record<CountryGroupId, FAQ>>>
> = {
	GuardianAdLite: guardianAdLiteFAQ,
	SupporterPlus: supporterPlusFAQ,
};
