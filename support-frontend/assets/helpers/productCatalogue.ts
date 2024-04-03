import { newspaperCountries } from 'helpers/internationalisation/country';
import { gwDeliverableCountries } from 'helpers/internationalisation/gwDeliverableCountries';

export function describeProduct(product: string, ratePlan: string) {
	let description = `${product} - ${ratePlan}`;
	let frequency = '';
	let showAddressFields = false;
	let addressCountries = {};
	let benefits: string[] = [];
	let benefitsDescription = '';

	/**
	 * This is not actually a product from our catalog,
	 * but a faux product we invesrted for the three tier test
	 **/
	if (product === 'GuardianWeeklyAndSupporterPlus') {
		description = 'Digital + print';
		benefits = [
			'Guardian Weekly print magazine delivered to your door every week',
		];
		benefitsDescription = 'The rewards from All-access digital';
	}

	if (product === 'Contribution') {
		description = 'Support';
		benefits = [
			'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
		];
	}

	if (product === 'SupporterPlus') {
		description = 'All-access digital';

		benefits = [
			'Unlimited access to the Guardian app',
			'Ad-free reading on all your devices',
			'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			'Far fewer asks for support',
		];
	}

	if (product === 'HomeDelivery') {
		frequency = 'month';
		description = `${ratePlan} paper`;

		showAddressFields = true;
		addressCountries = newspaperCountries;

		if (ratePlan === 'Sixday') {
			description = 'Six day paper';
		}
		if (ratePlan === 'Everyday') {
			description = 'Every day paper';
		}
		if (ratePlan === 'Weekend') {
			description = 'Weekend paper';
		}
		if (ratePlan === 'Saturday') {
			description = 'Saturday paper';
		}
		if (ratePlan === 'Sunday') {
			description = 'Sunday paper';
		}
	}

	if (product === 'NationalDelivery') {
		showAddressFields = true;
		addressCountries = newspaperCountries;
	}

	if (
		product === 'GuardianWeeklyDomestic' ||
		product === 'GuardianWeeklyRestOfWorld'
	) {
		showAddressFields = true;
		addressCountries = gwDeliverableCountries;

		if (ratePlan === 'OneYearGift') {
			frequency = 'year';
			description = 'The Guardian Weekly Gift Subscription';
		}
		if (ratePlan === 'Annual') {
			frequency = 'year';
			description = 'The Guardian Weekly';
		}
		if (ratePlan === 'Quarterly') {
			frequency = 'quarter';
			description = 'The Guardian Weekly';
		}
		if (ratePlan === 'Monthly') {
			frequency = 'month';
			description = 'The Guardian Weekly';
		}
		if (ratePlan === 'ThreeMonthGift') {
			frequency = 'quarter';
			description = 'The Guardian Weekly Gift Subscription';
		}
		if (ratePlan === 'SixWeekly') {
			frequency = 'month';
			description = 'The Guardian Weekly';
		}
	}

	return {
		description,
		frequency,
		showAddressFields,
		addressCountries,
		benefits,
		benefitsDescription,
	};
}
