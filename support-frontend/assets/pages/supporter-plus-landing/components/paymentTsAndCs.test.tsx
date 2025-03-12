import { render } from '@testing-library/react';
import { PaymentTsAndCs } from './paymentTsAndCs';

describe('Payment Ts&Cs Snapshot comparison', () => {
	it('render SupportPlus', () => {
		const { container } = render(
			<PaymentTsAndCs
				contributionType={'MONTHLY'}
				countryGroupId={'GBPCountries'}
				productKey={'SupporterPlus'}
				currency={'GBP'}
				amount={0}
				amountIsAboveThreshold={false}
			/>,
		);
		expect(container).toMatchSnapshot();
	});
});
