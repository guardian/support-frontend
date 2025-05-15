import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { SummaryTsAndCs } from './summaryTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/utilities/dateFormatting', () => ({
	getDateWithOrdinal: () => 'first',
	getLongMonth: () => 'March',
}));

describe('Summary Ts&Cs Snapshot comparison', () => {
	it.each`
		productKey               | billingPeriod
		${'Contribution'}        | ${'Monthly'}
		${'Contribution'}        | ${'Annual'}
		${'SupporterPlus'}       | ${'Monthly'}
		${'SupporterPlus'}       | ${'Annual'}
		${'TierThree'}           | ${'Monthly'}
		${'TierThree'}           | ${'Annual'}
		${'OneTimeContribution'} | ${'Monthly'}
		${'GuardianAdLite'}      | ${'Monthly'}
		${'GuardianAdLite'}      | ${'Annual'}
		${'DigitalSubscription'} | ${'Monthly'}
	`(
		`summaryTs&Cs for $productKey With billingPeriod $billingPeriod renders correctly`,
		({ productKey, billingPeriod }) => {
			const { container } = render(
				<SummaryTsAndCs
					billingPeriod={billingPeriod as BillingPeriod}
					productKey={productKey as ActiveProductKey}
					ratePlanKey={billingPeriod as ActiveRatePlanKey}
					currency={'GBP'}
					amount={0}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
