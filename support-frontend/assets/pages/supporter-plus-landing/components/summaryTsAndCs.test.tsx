import { render } from '@testing-library/react';
import type { RegularContributionTypeQuarterly } from 'helpers/contributions';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { SummaryTsAndCs } from './summaryTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/utilities/dateFormatting', () => ({
	getDateWithOrdinal: () => 'first',
	getLongMonth: () => 'March',
}));

describe('Summary Ts&Cs Snapshot comparison', () => {
	it.each`
		productKey               | contributionType
		${'Contribution'}        | ${'MONTHLY'}
		${'Contribution'}        | ${'ANNUAL'}
		${'SupporterPlus'}       | ${'MONTHLY'}
		${'SupporterPlus'}       | ${'ANNUAL'}
		${'TierThree'}           | ${'MONTHLY'}
		${'TierThree'}           | ${'ANNUAL'}
		${'OneTimeContribution'} | ${'MONTHLY'}
		${'GuardianAdLite'}      | ${'MONTHLY'}
		${'GuardianAdLite'}      | ${'ANNUAL'}
		${'DigitalSubscription'} | ${'MONTHLY'}
	`(
		`summaryTs&Cs for $productKey With contributionType $contributionType renders correctly`,
		({ productKey, contributionType }) => {
			const { container } = render(
				<SummaryTsAndCs
					contributionType={
						contributionType as RegularContributionTypeQuarterly
					}
					productKey={productKey as ActiveProductKey}
					ratePlanKey=""
					countryGroupId="GBPCountries"
					currency={'GBP'}
					amount={0}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
