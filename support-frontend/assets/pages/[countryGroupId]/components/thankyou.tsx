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
import { tests as abTests } from 'helpers/abTests/abtestDefinitions';
import type { ContributionType } from 'helpers/contributions';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import type { ProductKey } from 'helpers/productCatalog';
import {
	filterBenefitByRegion,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
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

const checkoutContainer = css`
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;
const headerContainer = css`
	${from.desktop} {
		width: 83%;
	}
	${from.leftCol} {
		width: calc(75% - ${space[3]}px);
	}
`;
const buttonContainer = css`
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
}

export type CheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	productKey?: ProductKey;
	ratePlanKey?: string;
	promotion?: Promotion;
};

export function ThankYouComponent({
	geoId,
	payment,
	productKey,
	ratePlanKey,
	promotion,
}: CheckoutComponentProps) {
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

	/**
	 * contributionType is only applicable to SupporterPlus and Contributions.
	 * We should remove it for something more generic.
	 */
	const isTier =
		productKey === 'Contribution' ||
		productKey === 'SupporterPlus' ||
		productKey === 'TierThree';
	let contributionType: ContributionType | undefined;
	switch (ratePlanKey) {
		case 'Monthly':
		case 'RestOfWorldMonthly':
		case 'DomesticMonthly':
		case 'RestOfWorldMonthlyV2':
		case 'DomesticMonthlyV2':
			contributionType = 'MONTHLY';
			break;
		case 'Annual':
		case 'RestOfWorldAnnual':
		case 'DomesticAnnual':
		case 'RestOfWorldAnnualV2':
		case 'DomesticAnnualV2':
			contributionType = 'ANNUAL';
			break;
		default:
			if (!productKey && !ratePlanKey) {
				contributionType = 'ONE_OFF';
			}
			break;
	}

	if (contributionType) {
		// track conversion with GTM
		const paymentMethod =
			order.paymentMethod === 'StripeExpressCheckoutElement'
				? 'Stripe'
				: order.paymentMethod;

		successfulContributionConversion(
			payment.originalAmount,
			contributionType,
			currencyKey,
			paymentMethod,
		);
		// track conversion with QM
		sendEventContributionCheckoutConversion(
			payment.originalAmount,
			contributionType,
			currencyKey,
		);
	}
	if (!contributionType) {
		return <div>Unable to find contribution type {contributionType}</div>;
	}

	const isOneOff = contributionType === 'ONE_OFF';
	const isOneOffPayPal = order.paymentMethod === 'PayPal' && isOneOff;
	const isSupporterPlus = productKey === 'SupporterPlus';
	const isTier3 = productKey === 'TierThree';

	// TODO - get this from the /identity/get-user-type endpoint
	const userTypeFromIdentityResponse = isSignedIn ? 'current' : 'new';
	const isNewAccount = userTypeFromIdentityResponse === 'new';
	const emailExists = !isNewAccount && isSignedIn;

	let benefitsChecklist;
	if (isTier) {
		const productDescription = productCatalogDescription[productKey];
		benefitsChecklist = [
			...productDescription.benefits
				.filter((benefit) => filterBenefitByRegion(benefit, countryGroupId))
				.map((benefit) => ({
					isChecked: true,
					text: benefit.copy,
				})),
			...(productDescription.benefitsAdditional ?? [])
				.filter((benefit) => filterBenefitByRegion(benefit, countryGroupId))
				.map((benefit) => ({
					isChecked: true,
					text: benefit.copy,
				})),
		];
	}

	const showNewspaperArchiveBenefit = abTests.newspaperArchiveBenefit.isActive;

	const thankYouModuleData = getThankYouModuleData(
		countryId,
		countryGroupId,
		csrf,
		isOneOff,
		isSupporterPlus,
		undefined,
		undefined,
		isTier3,
		benefitsChecklist,
	);
	const maybeThankYouModule = (
		condtion: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condtion ? [moduleType] : []);

	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(isNewAccount, 'signUp'), // Create your Guardian account
		...maybeThankYouModule(!isNewAccount && !isSignedIn, 'signIn'), // Sign in to access your benefits
		...maybeThankYouModule(isTier3, 'benefits'),
		...maybeThankYouModule(isTier3, 'subscriptionStart'),
		...maybeThankYouModule(isTier3 || isSupporterPlus, 'appsDownload'),
		...maybeThankYouModule(isOneOff && emailExists, 'supportReminder'),
		...maybeThankYouModule(
			isOneOff || (!(isTier3 && showNewspaperArchiveBenefit) && emailExists),
			'feedback',
		),
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		...maybeThankYouModule(!isTier3, 'socialShare'),
		...maybeThankYouModule(
			isTier3 && showNewspaperArchiveBenefit,
			'newspaperArchiveBenefit',
		),
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
							isSignedIn={isSignedIn}
							name={order.firstName}
							amount={payment.originalAmount}
							contributionType={contributionType}
							amountIsAboveThreshold={isSupporterPlus}
							isTier3={isTier3}
							isOneOffPayPal={isOneOffPayPal}
							showDirectDebitMessage={order.paymentMethod === 'DirectDebit'}
							currency={currencyKey}
							promotion={promotion}
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