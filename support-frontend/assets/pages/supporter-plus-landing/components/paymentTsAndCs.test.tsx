import { render } from '@testing-library/react';
import { PaymentTsAndCs } from './paymentTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/supporterPlus/benefitsThreshold', () => ({
	getLowerProductBenefitThreshold: () => 12,
}));

describe('Payment Ts&Cs Snapshot comparison', () => {
	it('render SupportPlus', () => {
		const { container } = render(
			<PaymentTsAndCs
				contributionType={'MONTHLY'}
				countryGroupId={'GBPCountries'}
				productKey={'SupporterPlus'}
				currency={'GBP'}
				amount={0}
				amountIsAboveThreshold={true}
			/>,
		);
		expect(container).toMatchSnapshot();
	});
});
