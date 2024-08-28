import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { TextInput } from '@guardian/source/react-components';
import { useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PriceCards } from 'components/priceCards/priceCards';
import Signout from 'components/signout/signout';
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
import { FormSection } from './components/formSection';
import { Legend } from './components/legend';
import {
	doesNotContainEmojiPattern,
	preventDefaultValidityMessage,
} from './validation';

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

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

type Props = {
	geoId: GeoId;
	appConfig: AppConfig;
};

export function OneTimeCheckout({ geoId, appConfig }: Props) {
	return <OneTimeCheckoutComponent geoId={geoId} appConfig={appConfig} />;
}

function OneTimeCheckoutComponent({ geoId, appConfig }: Props) {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const user = appConfig.user;
	const isSignedIn = !!user?.email;

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

	const [email, setEmail] = useState(user?.email ?? '');
	const [emailError, setEmailError] = useState<string>();

	const [billingPostcode, setBillingPostcode] = useState('');
	const [billingPostcodeError, setBillingPostcodeError] = useState<string>();

	const formRef = useRef<HTMLFormElement>(null);

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
			<form
				ref={formRef}
				action="todo"
				method="POST"
				onSubmit={() => {
					/* ToDo */
				}}
			>
				<Box cssOverrides={shorterBoxMargin}>
					<BoxContents>
						<FormSection>
							<Legend>1. Your details</Legend>
							<div>
								<TextInput
									id="email"
									data-qm-masking="blocklist"
									label="Email address"
									value={email}
									type="email"
									autoComplete="email"
									onChange={(event) => {
										setEmail(event.currentTarget.value);
									}}
									onBlur={(event) => {
										event.target.checkValidity();
									}}
									readOnly={isSignedIn}
									name="email"
									required
									maxLength={80}
									error={emailError}
									onInvalid={(event) => {
										preventDefaultValidityMessage(event.currentTarget);
										const validityState = event.currentTarget.validity;
										if (validityState.valid) {
											setEmailError(undefined);
										} else {
											if (validityState.valueMissing) {
												setEmailError('Please enter your email address.');
											} else {
												setEmailError('Please enter a valid email address.');
											}
										}
									}}
								/>
							</div>

							<Signout isSignedIn={isSignedIn} />

							{countryId === 'US' && (
								<div>
									<TextInput
										id="zipCode"
										label="ZIP code"
										name="billing-postcode"
										onChange={(event) => {
											setBillingPostcode(event.target.value);
										}}
										onBlur={(event) => {
											event.target.checkValidity();
										}}
										maxLength={20}
										value={billingPostcode}
										pattern={doesNotContainEmojiPattern}
										error={billingPostcodeError}
										onInvalid={(event) => {
											preventDefaultValidityMessage(event.currentTarget);
											const validityState = event.currentTarget.validity;
											if (validityState.valid) {
												setBillingPostcodeError(undefined);
											} else {
												if (!validityState.valueMissing) {
													setBillingPostcodeError(
														'Please enter a valid zip code.',
													);
												}
											}
										}}
									/>
								</div>
							)}
						</FormSection>
					</BoxContents>
				</Box>
			</form>
			<PatronsMessage countryGroupId={countryGroupId} mobileTheme={'light'} />
			<GuardianTsAndCs mobileTheme={'light'} displayPatronsCheckout={false} />
		</CheckoutLayout>
	);
}
