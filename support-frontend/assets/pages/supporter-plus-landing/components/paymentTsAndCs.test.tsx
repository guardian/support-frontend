import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { PaymentTsAndCs } from './paymentTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/supporterPlus/benefitsThreshold', () => ({
	getLowerProductBenefitThreshold: () => 12,
}));

describe('Payment Ts&Cs Snapshot comparison', () => {
	const productKeys = [
		['Contribution', 'UnitedStates'],
		['SupporterPlus', 'GBPCountries'],
		['TierThree', 'GBPCountries'],
		['OneTimeContribution', 'AUDCountries'],
		['GuardianAdLite', 'GBPCountries'],
		['DigitalSubscription', 'GBPCountries'],
	];
	it.each(productKeys)(
		`render product %s for region %s (above threshold %s) correctly`,
		(productKey, countryGroupId) => {
			console.log('productKey:', productKey);
			const { container } = render(
				<PaymentTsAndCs
					contributionType={'MONTHLY'}
					countryGroupId={countryGroupId as CountryGroupId}
					productKey={productKey as ActiveProductKey}
					currency={'GBP'}
					amount={0}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
