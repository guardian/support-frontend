import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import OrderedList from 'components/list/orderedList';
import type { Option } from 'helpers/types/option';
import { digitalSubscriptionLanding } from 'helpers/urls/routes';
import { formatUserDate } from 'helpers/utilities/dateConversions';

type PropTypes = {
	starts: Date;
	expires: Option<Date>;
	promoCode: string;
	countryGroupId: CountryGroupId;
};
export default function DigitalPackTerms(props: PropTypes) {
	const expiryCopy = props.expires
		? `The closing date and time of the promotion is ${formatUserDate(
				props.expires,
		  )}.
    Purchases after that date and time will not be eligible for the promotion.`
		: '';
	const copy = [
		'The promotion (the “Promotion”) is open to new Guardian Digital Subscription subscribers aged 18 and over ("you") subject to paragraph 2 below.',
		'By entering the promotion you are accepting these terms and conditions.',
		<div>
			To enter the promotion, you must: (i) either go to{' '}
			<a href={digitalSubscriptionLanding(props.countryGroupId)}>
				support.theguardian.com
			</a>{' '}
			or call +44 (0) 330 333 6767 and quote promotion code {props.promoCode}{' '}
			(ii) purchase a Guardian Digital Subscription and maintain that
			subscription for at least three months.
		</div>,
		'Entry to this promotion is available only to new subscribers: this means that you must not already have a subscription to the Guardian Digital Subscription to be eligible to participate in this Promotion.',
		<div>
			Please note that purchasing a subscription as referred to in paragraph 4
			above will also be subject to the terms and conditions for Guardian and
			Observer Digital subscriptions available at{' '}
			<a href="https://www.theguardian.com/digital-subscriptions-terms-conditions">
				theguardian.com/digital-subscriptions-terms-conditions
			</a>
		</div>,
		`The opening date and time of the Promotion is ${formatUserDate(
			props.starts,
		)}. ${expiryCopy}`,
		'If you opt to use the SMS response service to place your order you will be charged your standard network rate.',
		'Only one entry to this Promotion per person. Entries on behalf of another person will not be accepted.',
		'We take no responsibility for entries that are lost, delayed, misdirected or incomplete or cannot be delivered or entered for any technical or other reason. Proof of delivery of the entry is not proof of receipt.',
		'The Promoter of the Promotion is Guardian News & Media Limited whose address is Kings Place, 90 York Way, London N1 9GU. Any complaints regarding the Promotion should be sent to this address.',
		'Nothing in these terms and conditions shall exclude the liability of GNM for death, personal injury, fraud or fraudulent misrepresentation as a result of its negligence.',
		'GNM accepts no responsibility for any damage, loss, liabilities, injury or disappointment incurred or suffered by you as a result of entering the Promotion. GNM further disclaims liability for any injury or damage to you or any other person’s computer relating to or resulting from participation in the Promotion.',
		'GNM reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, this Promotion with or without prior notice due to reasons outside its control (including, without limitation, in the case of anticipated, suspected or actual fraud). The decision of GNM in all matters under its control is final and binding.',
		'GNM shall not be liable for any failure to comply with its obligations where the failure is caused by something outside its reasonable control. Such circumstances shall include, but not be limited to, weather conditions, fire, flood, hurricane, strike, industrial dispute, war, hostilities, political unrest, riots, civil commotion, inevitable accidents, supervening legislation or any other circumstances amounting to force majeure.',
	];
	return (
		<div>
			<OrderedList items={copy} />
		</div>
	);
}
