import { guardianAdLiteTermsLink } from 'helpers/legal';
import { helpCentreUrl } from 'helpers/urls/externalLinks';
import { rowSpacing } from 'pages/[countryGroupId]/components/accordianFAQStyles';
import type { FAQ } from 'pages/[countryGroupId]/components/accordionFAQ';

export const adLiteFAQs: FAQ = [
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
					A Guardian Ad-Lite subscription does not entitle you to the additional
					benefits on offer via our All-access digital and Digital + print
					subscriptions, which are stated <a href="/contribute">here</a>.
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
				To cancel, go to Manage my account, and for further information on your
				Guardian Ad-Lite subscription, see{' '}
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
];
