import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { PaymentTsAndCs } from './paymentTsAndCs';

describe('Payment Ts&Cs Snapshot comparison', () => {
	const paymentProductKeys = [
		['Contribution', 'UnitedStates'],
		['SupporterPlus', 'GBPCountries'],
		['TierThree', 'GBPCountries'],
		['OneTimeContribution', 'AUDCountries'],
		['GuardianAdLite', 'GBPCountries'],
		['DigitalSubscription', 'GBPCountries'],
	];
	it.each(paymentProductKeys)(
		`paymentTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, countryGroupId) => {
			const { container } = render(
				<PaymentTsAndCs
					contributionType={'MONTHLY'}
					countryGroupId={countryGroupId as CountryGroupId}
					productKey={paymentProductKey as ActiveProductKey}
					thresholdAmount={12}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
