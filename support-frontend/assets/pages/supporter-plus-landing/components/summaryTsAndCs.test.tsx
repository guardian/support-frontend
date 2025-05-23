import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { SummaryTsAndCs } from './summaryTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/utilities/dateFormatting', () => ({
	getDateWithOrdinal: () => 'first',
	getLongMonth: () => 'March',
}));

describe('Summary Ts&Cs Snapshot comparison', () => {
	it.each`
		productKey               | activeRatePlanKey
		${'Contribution'}        | ${'Monthly'}
		${'Contribution'}        | ${'Annual'}
		${'SupporterPlus'}       | ${'Monthly'}
		${'SupporterPlus'}       | ${'Annual'}
		${'TierThree'}           | ${'DomesticMonthly'}
		${'TierThree'}           | ${'DomesticAnnual'}
		${'OneTimeContribution'} | ${'OneTime'}
		${'GuardianAdLite'}      | ${'Monthly'}
		${'GuardianAdLite'}      | ${'Annual'}
		${'DigitalSubscription'} | ${'Monthly'}
	`(
		`summaryTs&Cs for $productKey With ratePlanKey $activeRatePlanKey renders correctly`,
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
