import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { CheckoutBenefitsListContainer } from 'components/checkoutBenefits/checkoutBenefitsListContainer';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutNudge } from 'components/checkoutNudge/checkoutNudge';
import { CheckoutNudgeContainer } from 'components/checkoutNudge/checkoutNudgeContainer';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { PriceCards } from 'components/priceCards/priceCards';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import type { Participations } from 'helpers/abTests/abtest';

type AmountAndBenefitsProps = {
	participations: Participations;
};

export function AmountAndBenefits({
	participations,
}: AmountAndBenefitsProps): JSX.Element {
	return (
		<PaymentFrequencyTabsContainer
			participations={participations}
			render={(tabProps) => (
				<PaymentFrequencyTabs
					{...tabProps}
					renderTabContent={(tabId) => (
						<BoxContents>
							<CheckoutErrorSummaryContainer
								renderSummary={({ errorList }) => (
									<CheckoutErrorSummary errorList={errorList} />
								)}
							/>
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
									hideChooseYourAmount,
									errors,
								}) => (
									<>
										<PriceCards
											amounts={amounts}
											selectedAmount={selectedAmount}
											currency={currency}
											paymentInterval={paymentInterval}
											onAmountChange={onAmountChange}
											hideChooseYourAmount={hideChooseYourAmount}
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
							<CheckoutNudgeContainer
								renderNudge={(nudgeProps) => <CheckoutNudge {...nudgeProps} />}
							/>
						</BoxContents>
					)}
				/>
			)}
		/>
	);
}
