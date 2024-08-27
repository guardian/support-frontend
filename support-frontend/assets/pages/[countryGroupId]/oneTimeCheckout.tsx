import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PriceCards } from 'components/priceCards/priceCards';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import { config } from 'helpers/contributions';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { BackButton } from './components/backButton';
import { CheckoutLayout } from './components/checkoutLayout';

const countryId = Country.detect();

const titleAndButtonContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 6px 0 ${space[3]}px;
	${from.desktop} {
		margin-bottom: 0;
	}
`;

const title = css`
	${headlineBold24};
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

type Props = {
	geoId: GeoId;
	appConfig: AppConfig;
};

export function OneTimeCheckout({ geoId, appConfig }: Props) {
	return <OneTimeCheckoutComponent geoId={geoId} appConfig={appConfig} />;
}

function OneTimeCheckoutComponent({ geoId }: Props) {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const settings = getSettings();
	const { selectedAmountsVariant } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		settings,
	);

	const { amountsCardData } = selectedAmountsVariant;
	const { amounts, defaultAmount, hideChooseYourAmount } =
		amountsCardData['ONE_OFF'];

	const minAmount = config[countryGroupId]['ONE_OFF'].min;

	const [amount, setAmount] = useState<number | 'other'>(defaultAmount);
	const [otherAmount, setOtherAmount] = useState<string>('');
	const [otherAmountErrors] = useState<string[]>([]);

	return (
		<CheckoutLayout>
			<Box>
				<BoxContents>
					<div
						css={css`
							${textSans17}
						`}
					>
						<div css={titleAndButtonContainer}>
							<h2 css={title}>Support just once</h2>
							<BackButton geoId={geoId} buttonText="back" />
						</div>
						<p css={standFirst}>Support us with the amount of your choice.</p>
						<PriceCards
							amounts={amounts}
							selectedAmount={amount}
							currency={currencyKey}
							onAmountChange={(amount: string) => {
								setAmount(
									amount === 'other' ? amount : Number.parseFloat(amount),
								);
							}}
							hideChooseYourAmount={hideChooseYourAmount}
							otherAmountField={
								<OtherAmount
									currency={currencyKey}
									minAmount={minAmount}
									selectedAmount={amount}
									otherAmount={otherAmount}
									onOtherAmountChange={setOtherAmount}
									errors={otherAmountErrors}
								/>
							}
						/>
					</div>
				</BoxContents>
			</Box>
			<form></form>
			<PatronsMessage countryGroupId={countryGroupId} mobileTheme={'light'} />
			<GuardianTsAndCs mobileTheme={'light'} displayPatronsCheckout={false} />
		</CheckoutLayout>
	);
}
