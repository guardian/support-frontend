import { render } from '@testing-library/react';
import { getFeatureFlags } from 'helpers/featureFlags';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { SummaryTsAndCs } from './summaryTsAndCs';

// Mocking price retrieval from productCatalog (not available in window at runtime)
jest.mock('helpers/featureFlags');
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
		${'SubscriptionCard'}    | ${'WeekendPlus'}
		${'HomeDelivery'}        | ${'SixdayPlus'}
		${'SubscriptionCard'}    | ${'Sunday'}
		${'HomeDelivery'}        | ${'Sunday'}
	`(
		`summaryTs&Cs for $productKey With ratePlanKey $activeRatePlanKey renders correctly`,
		({ productKey, activeRatePlanKey }) => {
			// Arrange
			(getFeatureFlags as jest.Mock).mockReturnValue({
				enablePremiumDigital: false,
				enableDigitalAccess: false,
			});

			// Act
			const { container } = render(
				<SummaryTsAndCs
					productKey={productKey as ActiveProductKey}
					ratePlanKey={activeRatePlanKey as ActiveRatePlanKey}
					ratePlanDescription={
						ratePlanDescription[activeRatePlanKey as ActiveRatePlanKey]
					}
					currency={'GBP'}
					amount={0}
				/>,
			);

			// Assert
			expect(container.textContent).toMatchSnapshot();
		},
	);

	it('renders summaryTs&Cs for the Digital SUbscription when the Premium Digital flag is enabled', () => {
		// Arrange
		(getFeatureFlags as jest.Mock).mockReturnValue({
			enablePremiumDigital: true,
		});

		// Act
		const { container } = render(
			<SummaryTsAndCs
				productKey="DigitalSubscription"
				ratePlanKey="Monthly"
				currency={'GBP'}
				amount={0}
			/>,
		);

		// Assert
		expect(container.textContent).toMatchSnapshot();
	});
});
