import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import { from, space, sport } from '@guardian/source/foundations';
import {
	Column,
	Columns,
	Container,
	LinkButton,
} from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import type { InferInput } from 'valibot';
import { object, picklist, safeParse, string } from 'valibot';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleData } from 'components/thankYou/thankYouModuleData';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import { get } from 'helpers/storage/cookie';
import { OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN } from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
import { sendEventContributionCheckoutConversion } from 'helpers/tracking/quantumMetric';
import { getUser } from 'helpers/user/user';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';
import ThankYouHeader from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import {
	columnContainer,
	firstColumnContainer,
} from 'pages/supporter-plus-thank-you/supporterPlusThankYou';

export const checkoutContainer = css`
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

export const headerContainer = css`
	${from.desktop} {
		width: 83%;
	}
	${from.leftCol} {
		width: calc(75% - ${space[3]}px);
	}
`;

export const buttonContainer = css`
	padding: ${space[12]}px 0;
`;

/**
 * The checkout page sets the order in sessionStorage
 * And the thank-you page reads it.
 */
const OrderSchema = object({
	firstName: string(),
	paymentMethod: picklist([
		'Stripe',
		'StripeExpressCheckoutElement',
		'PayPal',
		'DirectDebit',
		'Sepa',
		'AmazonPay',
		'None',
	]),
});
export function setThankYouOrder(order: InferInput<typeof OrderSchema>) {
	storage.session.set('thankYouOrder', order);
}
export function unsetThankYouOrder() {
	storage.session.remove('thankYouOrder');
} // Adjust the import path as necessary

type OneTimeThankyouProps = {
	geoId: GeoId;
	appConfig: AppConfig;
};

export function OneTimeThankYou({ geoId, appConfig }: OneTimeThankyouProps) {
	/** Get and validate the amount */
	const searchParams = new URLSearchParams(window.location.search);
	const contributionParam = searchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;
	const finalAmount = contributionAmount ?? 0;

	return (
		<OneTimeThankYouComponent
			geoId={geoId}
			appConfig={appConfig}
			finalAmount={finalAmount}
		/>
	);
}

type OneTimeCheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	finalAmount: number;
};

function OneTimeThankYouComponent({
	geoId,
	finalAmount,
}: OneTimeCheckoutComponentProps) {
	const countryId = CountryHelper.fromString(get('GU_country') ?? 'GB') ?? 'GB';
	const user = getUser();
	const isSignedIn = user.isSignedIn;
	const csrf = { token: window.guardian.csrf.token };

	const { countryGroupId, currencyKey } = getGeoIdConfig(geoId);

	const sessionStorageOrder = storage.session.get('thankYouOrder');
	const parsedOrder = safeParse(
		OrderSchema,
		storage.session.get('thankYouOrder'),
	);
	if (!parsedOrder.success) {
		return (
			<div>Unable to read your order {JSON.stringify(sessionStorageOrder)}</div>
		);
	}
	const order = parsedOrder.output;

	// track conversion with GTM
	const paymentMethod =
		order.paymentMethod === 'StripeExpressCheckoutElement'
			? 'Stripe'
			: order.paymentMethod;
	successfulContributionConversion(
		finalAmount,
		'ONE_OFF',
		currencyKey,
		paymentMethod,
	);

	// track conversion with QM
	sendEventContributionCheckoutConversion(finalAmount, 'ONE_OFF', currencyKey);

	const isOneOff = true;
	// TODO - get this from the /identity/get-user-type endpoint
	const userTypeFromIdentityResponse = isSignedIn ? 'current' : 'new';
	const isNewAccount = userTypeFromIdentityResponse === 'new';
	const emailExists = !isNewAccount && isSignedIn;
	const thankYouModuleData = getThankYouModuleData(
		countryId,
		countryGroupId,
		csrf,
		isOneOff,
		false,
	);
	const maybeThankYouModule = (
		condition: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condition ? [moduleType] : []);

	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(isNewAccount, 'signUp'), // Create your Guardian account
		...maybeThankYouModule(!isNewAccount && !isSignedIn, 'signIn'), // Sign in to access your benefits
		...maybeThankYouModule(emailExists, 'supportReminder'),
		'feedback',
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		'socialShare',
	];

	const numberOfModulesInFirstColumn = thankYouModules.length >= 6 ? 3 : 2;
	const firstColumn = thankYouModules.slice(0, numberOfModulesInFirstColumn);
	const secondColumn = thankYouModules.slice(numberOfModulesInFirstColumn);

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter />
				</FooterWithContents>
			}
		>
			<div css={checkoutContainer}>
				<Container>
					<div css={headerContainer}>
						<ThankYouHeader
							name={order.firstName}
							showDirectDebitMessage={false}
							isOneOffPayPal={false}
							contributionType={'ONE_OFF'}
							amount={finalAmount}
							currency={currencyKey}
							amountIsAboveThreshold={false}
							isTier3={false}
							isSignedIn={isSignedIn}
							// TODO - get this from the /identity/get-user-type endpoint
							userTypeFromIdentityResponse={userTypeFromIdentityResponse}
						/>
					</div>

					<Columns collapseUntil="desktop">
						<Column cssOverrides={[columnContainer, firstColumnContainer]}>
							{firstColumn.map((moduleType) => (
								<ThankYouModule
									moduleType={moduleType}
									isSignedIn={isSignedIn}
									{...thankYouModuleData[moduleType]}
								/>
							))}
						</Column>
						<Column cssOverrides={columnContainer}>
							{secondColumn.map((moduleType) => (
								<ThankYouModule
									moduleType={moduleType}
									isSignedIn={isSignedIn}
									{...thankYouModuleData[moduleType]}
								/>
							))}
						</Column>
					</Columns>

					<div css={buttonContainer}>
						<LinkButton
							href="https://www.theguardian.com"
							priority="tertiary"
							onClick={() =>
								trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
							}
						>
							Return to the Guardian
						</LinkButton>
					</div>
				</Container>
			</div>
		</PageScaffold>
	);
}
