import { useEffect } from 'react';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { OtherAmount } from '../../../components/otherAmount/otherAmount';
import { PriceCards } from '../../../components/priceCards/priceCards';
import type { CountryGroupId } from '../../../helpers/internationalisation/countryGroup';
import { setProductType } from '../../../helpers/redux/checkout/product/actions';

const REGIONAL_AMOUNTS: Record<CountryGroupId, number[]> = {
	GBPCountries: [300, 350, 500, 1000],
	UnitedStates: [250, 350, 500, 1000],
	EURCountries: [350, 400, 600, 1200],
	AUDCountries: [500, 700, 1000, 2000],
	Canada: [500, 600, 800, 1500],
	NZDCountries: [500, 700, 1000, 2000],
	International: [250, 350, 500, 1000],
};

export function PatronsPriceCards(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const amounts = REGIONAL_AMOUNTS[countryGroupId];

	const contributionType = 'ONE_OFF';

	useEffect(() => {
		console.log('Setting contribution type');
		dispatch(setProductType(contributionType));
	}, []);

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
						paymentFrequency={contributionType}
						renderPriceCards={({
							selectedAmount,
							otherAmount,
							currency,
							onAmountChange,
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
