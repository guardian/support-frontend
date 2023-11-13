import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
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
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
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
	const { internationalisation } = useContributionsSelector(
		(state) => state.common,
	);
	const campaignSettings = getCampaignSettings('Us_eoy_2023');

	const showUSCampaignTicker =
		internationalisation.countryGroupId === 'UnitedStates' && campaignSettings;

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
							{showUSCampaignTicker && (
								<div
									css={css`
										margin-top: -${space[2]}px;
										margin-bottom: ${space[3]}px;
									`}
								>
									<TickerContainer
										tickerId="US"
										countType={campaignSettings.tickerSettings.countType}
										endType={campaignSettings.tickerSettings.endType}
										headline={campaignSettings.tickerSettings.headline}
										render={(tickerProps) => <Ticker {...tickerProps} />}
									/>
								</div>
							)}
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
								frequency={tabId}
							/>
						</BoxContents>
					)}
				/>
			)}
		/>
	);
}
