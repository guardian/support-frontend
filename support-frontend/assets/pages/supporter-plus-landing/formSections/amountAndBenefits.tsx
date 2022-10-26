import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { CheckoutBenefitsListContainer } from 'components/checkoutBenefits/checkoutBenefitsListContainer';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { PriceCards } from 'components/priceCards/priceCards';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';

export function AmountAndBenefits(): JSX.Element {
	return (
		<PaymentFrequencyTabsContainer
			render={(tabProps) => (
				<PaymentFrequencyTabs
					{...tabProps}
					renderTabContent={(tabId) => (
						<BoxContents>
							<PriceCardsContainer
								frequency={tabId}
								renderPriceCards={({
									amounts,
									selectedAmount,
									otherAmount,
									currency,
									paymentInterval,
									onAmountChange,
									minAmount,
									onOtherAmountChange,
									errors,
								}) => (
									<>
										<PriceCards
											amounts={amounts}
											selectedAmount={selectedAmount}
											currency={currency}
											paymentInterval={paymentInterval}
											onAmountChange={onAmountChange}
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
									</>
								)}
							/>
							<CheckoutBenefitsListContainer
								renderBenefitsList={(benefitsListProps) => (
									<CheckoutBenefitsList {...benefitsListProps} />
								)}
							/>
						</BoxContents>
					)}
				/>
			)}
		/>
	);
}
