import { guardianAdLiteTermsLink } from 'helpers/legal';
import { helpCentreUrl } from 'helpers/urls/externalLinks';
import type { FAQItem } from 'pages/[countryGroupId]/components/accordionFAQ';

export const adLiteFAQs: FAQItem[] = [
	{
		title: 'What is included in my Guardian Ad-Lite subscription?',
		body: (
			<>
				<p>
					A Guardian Ad-Lite subscription enables you to read the Guardian
					website without personalised advertising (except for when we host
					third party content, like videos). You will still see advertising but
					it will be delivered without the use of personalised advertising
					cookies or similar technologies.
				</p>
				<p>
					A Guardian Ad-Lite subscription does not entitle you to the additional
					benefits on offer via our All-access digital and Digital + print
					subscriptions, which are stated <a href="/contribute">here</a>.
				</p>
			</>
		),
	},
	{
		title: 'Will my Guardian Ad-Lite subscription work across all devices?',
		body: (
			<p>
				You can read the Guardian website without personalised advertising
				across all devices by logging into your Guardian account. Guardian
				Ad-Lite applies to our website only, and not the Guardian Live App.
			</p>
		),
	},
	{
		title: 'How do I cancel my Guardian Ad-Lite subscription?',
		body: (
			<p>
				To cancel, go to Manage my account, and for further information on your
				Guardian Ad-Lite subscription, see{' '}
				<a href={guardianAdLiteTermsLink}>here</a>.
			</p>
		),
	},
	{
		title: 'How do I contact customer services?',
		body: (
			<p>
				For any queries, including subscription-related queries, please visit
				our <a href={helpCentreUrl}>Help centre</a>, where you will also find
				contact details for your region.
			</p>
		),
	},
];
