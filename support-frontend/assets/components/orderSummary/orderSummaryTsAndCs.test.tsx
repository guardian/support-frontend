import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { OrderSummaryTsAndCs } from './orderSummaryTsAndCs';

describe('Payment Ts&Cs Snapshot comparison', () => {
	const paymentProductKeys = [
		['GuardianAdLite', 'GBPCountries', 0],
		['Contribution', 'UnitedStates', 0],
		['SupporterPlus', 'GBPCountries', 12],
		['TierThree', 'AUDCountries', 27],
	];
	it.each(paymentProductKeys)(
		`orderSummaryTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, countryGroupId, amount) => {
			const { container } = render(
				<OrderSummaryTsAndCs
					contributionType={'MONTHLY'}
					countryGroupId={countryGroupId as CountryGroupId}
					productKey={paymentProductKey as ActiveProductKey}
					thresholdAmount={amount as number}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
