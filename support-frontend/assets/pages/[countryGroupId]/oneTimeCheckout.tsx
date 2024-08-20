import { css } from '@emotion/react';
import {
	from,
	headline,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { Link } from '@guardian/source/react-components';
import { useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PriceCards } from 'components/priceCards/priceCards';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { CheckoutLayout } from './components/checkoutScaffold';

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
	${headline.xsmall({ fontWeight: 'bold' })}
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
	const [amount, setAmount] = useState<string>('other');
	const [otherAmount, setOtherAmount] = useState<string>('');

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
							<Link href="" />
						</div>
						<p css={standFirst}>Support us with the amount of your choice.</p>
						<PriceCards
							amounts={[1, 5, 10]}
							selectedAmount={amount as number | 'other'}
							currency={currencyKey}
							paymentInterval={'month'}
							onAmountChange={setAmount}
							hideChooseYourAmount={false}
							otherAmountField={
								<OtherAmount
									currency={currencyKey}
									minAmount={2}
									selectedAmount={amount as number | 'other'}
									otherAmount={otherAmount}
									onOtherAmountChange={setOtherAmount}
									errors={[]}
								/>
							}
						/>
					</div>
				</BoxContents>
			</Box>
			<form
				css={css`
					height: 50px;
				`}
			></form>
			<PatronsMessage countryGroupId={countryGroupId} mobileTheme={'light'} />
			<GuardianTsAndCs mobileTheme={'light'} displayPatronsCheckout={false} />
		</CheckoutLayout>
	);
}
