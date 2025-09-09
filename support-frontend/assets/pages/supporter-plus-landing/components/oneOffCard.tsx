import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
	textSans15,
	until,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'react';
import { OtherAmount } from '../../../components/otherAmount/otherAmount';
import { PriceCards } from '../../../components/priceCards/priceCards';
import type { SelectedAmountsVariant } from '../../../helpers/contributions';
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
const standFirst = css`
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

interface Props {
	amounts: SelectedAmountsVariant;
	currencyGlyph: string;
	countryGroupId: CountryGroupId;
	currencyId: IsoCurrency;
	heading: JSX.Element | undefined;
}

export function OneOffCard({
	currencyGlyph,
	countryGroupId,
	amounts,
	currencyId,
	heading,
}: Props) {
	const oneOffAmounts = amounts.amountsCardData.ONE_OFF;
	const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(
		oneOffAmounts.defaultAmount,
	);
	const [otherAmount, setOtherAmount] = useState('');
	return (
		<section css={sectionStyle}>
			<div
				css={css`
					${textSans15}
				`}
			>
				<h2 css={titleStyle}>{heading ?? 'Support just once'}</h2>
				<p css={standFirst}>
					We welcome support of any size, any time, whether you choose to give{' '}
					{currencyGlyph}1 or much more.
				</p>

				<PriceCards
					amounts={oneOffAmounts.amounts}
					selectedAmount={selectedAmount}
					currency={currencyId}
					billingPeriod={BillingPeriod.OneTime}
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
					hideChooseYourAmount={oneOffAmounts.hideChooseYourAmount}
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
				<LinkButton
					href={`/${
						countryGroups[countryGroupId].supportInternationalisationId
					}/contribute/checkout?selected-contribution-type=one_off&selected-amount=${
						selectedAmount === 'other' ? otherAmount : selectedAmount
					}`}
					cssOverrides={btnStyleOverrides}
					onClick={() => {
						trackComponentClick(
							`npf-contribution-amount-toggle-${countryGroupId}-ONE_OFF`,
						);
					}}
					theme={themeButtonReaderRevenueBrand}
				>
					Continue to checkout
				</LinkButton>
				<PaymentCards />
			</div>
		</section>
	);
}
