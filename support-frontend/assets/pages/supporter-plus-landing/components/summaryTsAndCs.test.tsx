import { render } from '@testing-library/react';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { SummaryTsAndCs } from './summaryTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock(
	'./TsAndCsRenewal',
	() =>
		function () {
			return <div>on the first day of every month</div>;
		},
);

describe('Summary Ts&Cs Snapshot comparison', () => {
	const summaryProductKeys: ActiveProductKey[] = [
		'Contribution',
		'SupporterPlus',
		'TierThree',
		'OneTimeContribution',
		'GuardianAdLite',
		'DigitalSubscription',
	];
	it.each(summaryProductKeys)(
		`summaryTs&Cs render product %s correctly`,
		(summaryProductKey) => {
			const { container } = render(
				<SummaryTsAndCs
					contributionType={'MONTHLY'}
					productKey={summaryProductKey}
					currency={'GBP'}
					amount={0}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
