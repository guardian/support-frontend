import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
	textSans15,
	until,
} from '@guardian/source/foundations';
import {
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source/react-components';
import { useState } from 'react';
import type { PriceCardPaymentInterval } from 'components/priceCards/priceCard';
import { OtherAmount } from '../../../components/otherAmount/otherAmount';
import { PriceCards } from '../../../components/priceCards/priceCards';
import type {
	AmountValuesObject,
	ContributionType,
} from '../../../helpers/contributions';
import type { CountryGroupId } from '../../../helpers/internationalisation/countryGroup';
import type { IsoCurrency } from '../../../helpers/internationalisation/currency';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';
import { PaymentCards } from './PaymentIcons';

const sectionStyle = css`
	max-width: 600px;
	margin: auto;
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: 32px;
	${until.desktop} {
		padding-top: ${space[6]}px;
	}
`;
const titleStyle = css`
	margin: 0 0 ${space[2]}px;
	text-align: center;
	${headlineBold24}
	${from.tablet} {
		font-size: 28px;
	}
`;
const standFirstStyle = css`
	color: #606060;
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		margin-bottom: ${space[3]}px;
	}
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[3]}px;
	margin-top: ${space[5]}px;
`;

const buttonContainer = css`
	display: flex;
	flex-direction: column;
`;

interface AmountsCardProps {
	amountsData: AmountValuesObject;
	countryGroupId: CountryGroupId;
	currencyId: IsoCurrency;
	heading?: JSX.Element;
	standFirst?: JSX.Element;
	contributionType: ContributionType;
}

export function AmountsCard({
	countryGroupId,
	amountsData,
	currencyId,
	heading,
	standFirst,
	contributionType,
}: AmountsCardProps) {
	const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(
		amountsData.defaultAmount,
	);
	const [otherAmount, setOtherAmount] = useState('');

	const billingPeriod = contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	const amount = selectedAmount === 'other' ? otherAmount : selectedAmount;
	const checkoutLink =
		contributionType === 'ONE_OFF'
			? `one-time-checkout?contribution=${amount}`
			: `checkout?product=Contribution&ratePlan=${billingPeriod}&contribution=${amount}`;

	const contributionTypeToPaymentInterval: Partial<
		Record<ContributionType, PriceCardPaymentInterval>
	> = {
		MONTHLY: 'month',
		ANNUAL: 'year',
	};

	return (
		<section css={sectionStyle}>
			<div
				css={css`
					${textSans15}
				`}
			>
				{heading && <h2 css={titleStyle}>{heading}</h2>}
				{standFirst && <p css={standFirstStyle}>{standFirst}</p>}
				<PriceCards
					amounts={amountsData.amounts}
					selectedAmount={selectedAmount}
					currency={currencyId}
					paymentInterval={contributionTypeToPaymentInterval[contributionType]}
					onAmountChange={(amount: string) => {
						if (amount === 'other') {
							setSelectedAmount(amount);
						} else {
							const amountNumber = parseInt(amount, 10);
							if (!isNaN(amountNumber)) {
								setSelectedAmount(amountNumber);
							}
						}
					}}
					hideChooseYourAmount={amountsData.hideChooseYourAmount}
					otherAmountField={
						<OtherAmount
							currency={currencyId}
							selectedAmount={selectedAmount}
							otherAmount={otherAmount}
							onOtherAmountChange={(otherAmount) => {
								setOtherAmount(otherAmount);
							}}
							errors={[]}
						/>
					}
				/>
			</div>
			<div css={buttonContainer}>
				<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
					<LinkButton
						href={checkoutLink}
						cssOverrides={btnStyleOverrides}
						onClick={() => {
							trackComponentClick(
								`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}`,
							);
						}}
					>
						Continue to checkout
					</LinkButton>
				</ThemeProvider>
				<PaymentCards />
			</div>
		</section>
	);
}
