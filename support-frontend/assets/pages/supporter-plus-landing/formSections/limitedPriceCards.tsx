import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import { SimplePriceCards } from 'components/priceCards/simplePriceCards';

const accordionHeading = css`
	${textSans.small()};
	color: #606060;
	margin-bottom: 10px;
`;

export function LimitedPriceCards(): JSX.Element {
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
						frequency="ANNUAL"
						renderPriceCards={({
							selectedAmount,
							currency,
							paymentInterval,
							onAmountChange,
						}) => (
							<SimplePriceCards
								title="Support Guardian journalism"
								subtitle="and unlock exclusive extras"
								contributionType="ANNUAL"
								countryGroupId="GBPCountries"
								prices={{
									monthly: 10,
									annual: 95,
								}}
								onPriceChange={console.log}
							>
								<div>
									<h2 css={accordionHeading}>Exclusive extras include:</h2>
									<div
										css={css`
											margin-bottom: 16px;
										`}
									>
										{/* <List {...List.args} /> */}
									</div>
									{/* <InfoBlock {...InfoBlock.args} /> */}
								</div>
							</SimplePriceCards>
						)}
					/>
				</BoxContents>
			)}
		/>
	);
}
