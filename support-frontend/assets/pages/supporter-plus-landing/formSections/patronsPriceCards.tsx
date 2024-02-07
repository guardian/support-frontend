import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { OtherAmount } from '../../../components/otherAmount/otherAmount';
import { PriceCards } from '../../../components/priceCards/priceCards';
import type { CountryGroupId } from '../../../helpers/internationalisation/countryGroup';

const REGIONAL_AMOUNTS: Record<CountryGroupId, string[]> = {
	GBPCountries: ['300', '350', '500', '1000'],
	UnitedStates: ['300', '350', '500', '1000'],
	AUDCountries: ['300', '350', '500', '1000'],
	Canada: ['300', '350', '500', '1000'],
	NZDCountries: ['300', '350', '500', '1000'],
	International: ['300', '350', '500', '1000'],
	EURCountries: ['300', '350', '500', '1000'],
};

export function PatronsPriceCards(): JSX.Element {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const amounts = REGIONAL_AMOUNTS[countryGroupId];

	const contributionType = 'ONE_OFF';

	return (
		<PaymentFrequencyTabsContainer
			render={() => (
				<BoxContents>
					<CheckoutErrorSummaryContainer
						renderSummary={({ errorList }) => (
							<CheckoutErrorSummary errorList={errorList} />
						)}
					/>
					<PriceCardsContainer
						frequency={contributionType}
						renderPriceCards={({
							selectedAmount,
							otherAmount,
							currency,
							onAmountChange,
							minAmount,
							onOtherAmountChange,
							errors,
						}) => {
							return (
								<PriceCards
									amounts={amounts}
									selectedAmount={selectedAmount}
									currency={currency}
									onAmountChange={onAmountChange}
									hideChooseYourAmount={false}
									otherAmountField={
										<OtherAmount
											currency={currency}
											minAmount={minAmount}
											selectedAmount={selectedAmount}
											otherAmount={otherAmount}
											onOtherAmountChange={onOtherAmountChange}
											errors={errors}
										/>
									}
								/>
							);
						}}
					/>
				</BoxContents>
			)}
		/>
	);
}
