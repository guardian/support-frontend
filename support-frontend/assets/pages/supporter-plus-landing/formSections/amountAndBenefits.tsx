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
import { Ticker } from 'components/ticker/ticker';
import { TickerContainer } from 'components/ticker/tickerContainer';
import Tooltip from 'components/tooltip/Tooltip';
import { TooltipContainer } from 'components/tooltip/TooltipContainer';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { useContributionsSelector } from 'helpers/redux/storeHooks';

export function AmountAndBenefits({
	countryGroupId,
	amountIsAboveThreshold,
	showCancelTooltip,
	addBackgroundToBenefitsList,
	isCompactBenefitsList,
}: {
	countryGroupId: CountryGroupId;
	amountIsAboveThreshold: boolean;
	showCancelTooltip?: boolean;
	addBackgroundToBenefitsList?: boolean;
	isCompactBenefitsList?: boolean;
}): JSX.Element {
	const { usCampaignTicker } = useContributionsSelector(
		(state) => state.common.abParticipations,
	);
	return (
		<PaymentFrequencyTabsContainer
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
							{usCampaignTicker === 'variant' && (
								<TickerContainer
									countType="money"
									endType="unlimited"
									currencySymbol="$"
									copy={{
										countLabel: '',
										goalReachedPrimary: '',
										goalReachedSecondary: '',
									}}
									render={(tickerProps) => <Ticker {...tickerProps} />}
								/>
							)}
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
									<CheckoutBenefitsList
										{...benefitsListProps}
										withBackground={addBackgroundToBenefitsList}
										isCompactList={!!isCompactBenefitsList}
									/>
								)}
							/>
							{showCancelTooltip && (
								<TooltipContainer
									renderTooltip={() => (
										<Tooltip promptText="Cancel anytime">
											<p>
												You can cancel
												{countryGroupId === 'GBPCountries'
													? ''
													: ' online'}{' '}
												anytime before your next payment date.
												{amountIsAboveThreshold && (
													<>
														{' '}
														If you cancel in the first 14 days, you will receive
														a full refund.
													</>
												)}
											</p>
										</Tooltip>
									)}
								/>
							)}

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
