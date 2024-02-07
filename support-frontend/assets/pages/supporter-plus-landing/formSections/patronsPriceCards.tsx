import { useEffect } from 'react';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import {
	setSelectedAmount,
	setSelectedAmountBeforeAmendment,
} from 'helpers/redux/checkout/product/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { PriceCards } from '../../../components/priceCards/priceCards';
import type {
	CountryGroupId} from '../../../helpers/internationalisation/countryGroup';

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
	const dispatch = useContributionsDispatch();
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const amounts = REGIONAL_AMOUNTS[countryGroupId];

	const contributionType = 'ONE_OFF';

	useEffect(() => {
		dispatch(
			setSelectedAmount({
				contributionType,
				amount: amounts[1],
			}),
		);
	}, []);

	return (
		<PaymentFrequencyTabsContainer
			render={({ onTabChange }) => (
				<BoxContents>
					<CheckoutErrorSummaryContainer
						renderSummary={({ errorList }) => (
							<CheckoutErrorSummary errorList={errorList} />
						)}
					/>
					<PriceCardsContainer
						frequency={contributionType}
						renderPriceCards={({ selectedAmount }) => {
							console.log({ selectedAmount });
							return (
								<PriceCards
									amounts={amounts}
									selectedAmount={selectedAmount}
									currency={'GBP'}
									// paymentInterval={paymentInterval}
									onAmountChange={(amount) => {
										onTabChange(contributionType);
										dispatch(
											setSelectedAmount({
												contributionType,
												amount: amount.toString(),
											}),
										);
										dispatch(
											setSelectedAmountBeforeAmendment({
												contributionType,
												amount: amount.toString(),
											}),
										);
									}}
									hideChooseYourAmount={true}
									// otherAmountField={
									//   <OtherAmount
									//     currency={'GBP'}
									//     minAmount={2}
									//     selectedAmount={selectedAmount}
									//     otherAmount={otherAmount}
									//     onOtherAmountChange={onOtherAmountChange}
									//     errors={errors}
									//   />
									// }
								/>
							);
						}}
					/>
				</BoxContents>
			)}
		/>
	);
}
