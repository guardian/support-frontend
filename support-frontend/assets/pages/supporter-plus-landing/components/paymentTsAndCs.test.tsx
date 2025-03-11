import { create } from 'react-test-renderer';
import { PaymentTsAndCs } from './paymentTsAndCs';

function Link() {
	return <div>Hello World</div>;
}

describe('Payment Ts&Cs Snapshot comparison', () => {
	it('renders correctly', () => {
		const tree = create(<Link />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('render SupportPlus', () => {
		const tree = create(
			<PaymentTsAndCs
				contributionType={'MONTHLY'}
				countryGroupId={'GBPCountries'}
				productKey={'SupporterPlus'}
				currency={'GBP'}
				amount={0}
			/>,
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
