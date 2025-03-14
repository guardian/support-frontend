import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { PaymentTsAndCs } from './paymentTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/supporterPlus/benefitsThreshold', () => ({
	getLowerProductBenefitThreshold: () => 12,
}));
// jest.mock('./TsAndCsRenewal', () => ({
// 	default: () => 'on the first day of every month',
// }));

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
					currency={'GBP'}
					amount={0}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
