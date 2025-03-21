import { render } from '@testing-library/react';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { SubscriptionStartItems } from './subscriptionStartItems';

describe('Summary Ts&Cs Snapshot comparison', () => {
	const summaryProductKeys: ActiveProductKey[] = [
		'HomeDelivery',
		'NationalDelivery',
		'SubscriptionCard',
		'GuardianWeeklyRestOfWorld',
		'GuardianWeeklyDomestic',
		'TierThree',
	];
	it.each(summaryProductKeys)(
		`summaryTs&Cs render product %s correctly`,
		(summaryProductKey) => {
			const { container } = render(
				<SubscriptionStartItems
					productKey={summaryProductKey}
					startDate="01-01-25"
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
