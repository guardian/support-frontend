import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { SummaryTsAndCs } from './summaryTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/utilities/dateFormatting', () => ({
	getDateWithOrdinal: () => 'first',
	getLongMonth: () => 'March',
}));

describe('Summary Ts&Cs Snapshot comparison', () => {
	it.each`
		productKey               | activeRatePlanKey
		${'Contribution'}        | ${BillingPeriod.Monthly}
		${'Contribution'}        | ${BillingPeriod.Annual}
		${'SupporterPlus'}       | ${BillingPeriod.Monthly}
		${'SupporterPlus'}       | ${BillingPeriod.Annual}
		${'TierThree'}           | ${BillingPeriod.Monthly}
		${'TierThree'}           | ${BillingPeriod.Annual}
		${'OneTimeContribution'} | ${BillingPeriod.Monthly}
		${'GuardianAdLite'}      | ${BillingPeriod.Monthly}
		${'GuardianAdLite'}      | ${BillingPeriod.Annual}
		${'DigitalSubscription'} | ${BillingPeriod.Monthly}
	`(
		`summaryTs&Cs for $productKey With billingPeriod $billingPeriod renders correctly`,
		({ productKey, activeRatePlanKey }) => {
			const { container } = render(
				<SummaryTsAndCs
					productKey={productKey as ActiveProductKey}
					ratePlanKey={activeRatePlanKey as ActiveRatePlanKey}
					currency={'GBP'}
					amount={0}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
