import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import {
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source/react-components';
import { useState } from 'react';
import { config, type SelectedAmountsVariant } from 'helpers/contributions';
import {
	type CountryGroupId,
	countryGroups,
} from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { OtherAmount } from '../../../components/otherAmount/otherAmount';
import { PriceCards } from '../../../components/priceCards/priceCards';
import { PaymentCards } from './PaymentIcons';

const sectionStyle = css`
	max-width: 600px;
	margin: auto;
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: 32px 48px ${space[6]}px 48px;
	${until.desktop} {
		padding-top: ${space[6]}px;
	}
`;
const titleStyle = css`
	margin: 0 0 ${space[3]}px;
	text-align: center;
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 22px;
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
	margin-bottom: ${space[6]}px;
	margin-top: ${space[6]}px;
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
}

export function OneOffCard({
	currencyGlyph,
	countryGroupId,
	amounts,
	currencyId,
}: Props) {
	const oneOffAmounts = amounts.amountsCardData.ONE_OFF;
	const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(
		oneOffAmounts.defaultAmount,
	);
	const [otherAmount, setOtherAmount] = useState('');
	const { min: minAmount } = config[countryGroupId].ONE_OFF;

	return (
		<section css={sectionStyle}>
			<div
				css={css`
					${textSans.medium()}
				`}
			>
				<h2 css={titleStyle}>Support just once</h2>
				<p css={standFirst}>
					We welcome support of any size, any time, whether you choose to give{' '}
					{currencyGlyph}1 or much more.
				</p>

				<PriceCards
					amounts={oneOffAmounts.amounts}
					selectedAmount={selectedAmount}
					currency={currencyId}
					// This is always undefined as we're ONE_OFF
					paymentInterval={undefined}
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
							minAmount={minAmount}
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
						href={`/${countryGroups[countryGroupId].supportInternationalisationId}/contribute/checkout?selected-contribution-type=one_off&selected-amount=${selectedAmount}`}
						cssOverrides={btnStyleOverrides}
						onClick={() => {
							trackComponentClick(
								`npf-contribution-amount-toggle-${countryGroupId}-ONE_OFF`,
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
