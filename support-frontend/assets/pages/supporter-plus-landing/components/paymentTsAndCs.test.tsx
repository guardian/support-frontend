import { render } from '@testing-library/react';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { PaymentTsAndCs } from './paymentTsAndCs';

describe('Payment Ts&Cs Snapshot comparison', () => {
	const promotionTierThreUnitedStatesMonthly: Promotion = {
		name: '$8 off for 12 months',
		description: 'Tier Three United States Monthly',
		promoCode: 'TIER_THREE_USA_MONTHLY',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 37,
	};
	const paymentProductKeys = [
		['GuardianAdLite', 'ANNUAL', 'GBPCountries', 0],
		['DigitalSubscription', 'MONTHLY', 'GBPCountries', 0],
		['OneTimeContribution', 'MONTHLY', 'UnitedStates', 0],
		['Contribution', 'ANNUAL', 'AUDCountries', 0],
		['SupporterPlus', 'MONTHLY', 'GBPCountries', 12],
		['TierThree', 'MONTHLY', 'UnitedStates', 45],
		['HomeDelivery', 'MONTHLY', 'GBPCountries', 0],
		['NationalDelivery', 'MONTHLY', 'GBPCountries', 0],
		['SubscriptionCard', 'MONTHLY', 'GBPCountries', 0],
	];
	it.each(paymentProductKeys)(
		`paymentTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, contributionType, countryGroupId, amount) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				contributionType === 'MONTHLY' &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreUnitedStatesMonthly
					: undefined;
			const { container } = render(
				<PaymentTsAndCs
					contributionType={contributionType as ContributionType}
					countryGroupId={countryGroupId as CountryGroupId}
					productKey={paymentProductKey as ActiveProductKey}
					thresholdAmount={amount as number}
					promotion={promo}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
