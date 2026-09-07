import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
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

const promotionUSDSupporterPlus: Promotion = {
	name: 'Supporter Plus Promo',
	description: 'USD offer for Supporter Plus',
	promoCode: 'S_PLUS_MONTHLY_BAU_USDCAN',
	numberOfDiscountedPeriods: 6,
	discountedPrice: 15,
	isIntroductoryPricing: false,
};

describe('Summary Ts&Cs Snapshot comparison', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each`
		productKey               | activeRatePlanKey | countryGroupId    | currency
		${'Contribution'}        | ${'Monthly'}      | ${'GBPCountries'} | ${'GBP'}
		${'Contribution'}        | ${'Annual'}       | ${'GBPCountries'} | ${'GBP'}
		${'SupporterPlus'}       | ${'Monthly'}      | ${'GBPCountries'} | ${'GBP'}
		${'SupporterPlus'}       | ${'Monthly'}      | ${'UnitedStates'} | ${'USD'}
		${'SupporterPlus'}       | ${'Annual'}       | ${'GBPCountries'} | ${'GBP'}
		${'OneTimeContribution'} | ${'OneTime'}      | ${'GBPCountries'} | ${'GBP'}
		${'GuardianAdLite'}      | ${'Monthly'}      | ${'GBPCountries'} | ${'GBP'}
		${'GuardianAdLite'}      | ${'Annual'}       | ${'GBPCountries'} | ${'GBP'}
		${'DigitalSubscription'} | ${'Monthly'}      | ${'UnitedStates'} | ${'USD'}
		${'DigitalSubscription'} | ${'Annual'}       | ${'GBPCountries'} | ${'GBP'}
		${'SubscriptionCard'}    | ${'WeekendPlus'}  | ${'GBPCountries'} | ${'GBP'}
		${'HomeDelivery'}        | ${'SixdayPlus'}   | ${'GBPCountries'} | ${'GBP'}
		${'SubscriptionCard'}    | ${'Sunday'}       | ${'GBPCountries'} | ${'GBP'}
		${'HomeDelivery'}        | ${'Sunday'}       | ${'GBPCountries'} | ${'GBP'}
	`(
		`summaryTs&Cs for $productKey With ratePlanKey $activeRatePlanKey ($countryGroupId / $currency) renders correctly`,
		({ productKey, activeRatePlanKey, countryGroupId, currency }) => {
			// Act
			const { container } = render(
				<SummaryTsAndCs
					productKey={productKey as ActiveProductKey}
					ratePlanKey={activeRatePlanKey as ActiveRatePlanKey}
					countryGroupId={countryGroupId as CountryGroupId}
					ratePlanDescription={
						ratePlanDescription[activeRatePlanKey as ActiveRatePlanKey]
					}
					currency={currency as CurrencyCode}
					amount={
						countryGroupId === 'UnitedStates'
							? productKey === 'SupporterPlus'
								? 18
								: 25
							: 0
					}
					promotion={
						countryGroupId === 'UnitedStates' && productKey === 'SupporterPlus'
							? promotionUSDSupporterPlus
							: undefined
					}
				/>,
			);

			// Assert
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
