import type { CurrencyCode } from '@modules/internationalisation/currency';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
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

const ratePlanDescription: Partial<
	Record<ActiveRatePlanKey, string | undefined>
> = {
	WeekendPlus: 'Weekend Plus',
	SixdayPlus: 'Six Day Plus',
	Sunday: 'The Observer',
};

describe('Summary Ts&Cs Snapshot comparison', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each`
		productKey               | activeRatePlanKey | supportRegionId | currency
		${'Contribution'}        | ${'Monthly'}      | ${'uk'}         | ${'GBP'}
		${'Contribution'}        | ${'Annual'}       | ${'uk'}         | ${'GBP'}
		${'SupporterPlus'}       | ${'Monthly'}      | ${'uk'}         | ${'GBP'}
		${'SupporterPlus'}       | ${'Monthly'}      | ${'us'}         | ${'USD'}
		${'SupporterPlus'}       | ${'Annual'}       | ${'uk'}         | ${'GBP'}
		${'OneTimeContribution'} | ${'OneTime'}      | ${'uk'}         | ${'GBP'}
		${'GuardianAdLite'}      | ${'Monthly'}      | ${'uk'}         | ${'GBP'}
		${'GuardianAdLite'}      | ${'Annual'}       | ${'uk'}         | ${'GBP'}
		${'DigitalSubscription'} | ${'Monthly'}      | ${'us'}         | ${'USD'}
		${'DigitalSubscription'} | ${'Annual'}       | ${'uk'}         | ${'GBP'}
		${'SubscriptionCard'}    | ${'WeekendPlus'}  | ${'uk'}         | ${'GBP'}
		${'HomeDelivery'}        | ${'SixdayPlus'}   | ${'uk'}         | ${'GBP'}
		${'SubscriptionCard'}    | ${'Sunday'}       | ${'uk'}         | ${'GBP'}
		${'HomeDelivery'}        | ${'Sunday'}       | ${'uk'}         | ${'GBP'}
	`(
		`summaryTs&Cs for $productKey With ratePlanKey $activeRatePlanKey ($supportRegionId / $currency) renders correctly`,
		({ productKey, activeRatePlanKey, supportRegionId, currency }) => {
			// Act
			const { container } = render(
				<SummaryTsAndCs
					productKey={productKey as ActiveProductKey}
					ratePlanKey={activeRatePlanKey as ActiveRatePlanKey}
					supportRegionId={supportRegionId as SupportRegionId}
					ratePlanDescription={
						ratePlanDescription[activeRatePlanKey as ActiveRatePlanKey]
					}
					currency={currency as CurrencyCode}
					amount={0}
				/>,
			);

			// Assert
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
