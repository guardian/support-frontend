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
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import type { ProductKey } from 'helpers/productCatalog';
import {
	filterBenefitByRegion,
	isProductKey,
	productCatalog,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
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
}

type Props = {
	geoId: GeoId;
	appConfig: AppConfig;
};

export function ThankYou({ geoId, appConfig }: Props) {
	/** 👇 a lot of this is copy/pasted from the checkout */
	const countryId = CountryHelper.detect();

	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	const searchParams = new URLSearchParams(window.location.search);

	/** Get and validate product */
	const productParam = searchParams.get('product');
	const productKey =
		productParam && isProductKey(productParam) ? productParam : undefined;
	const product = productKey && productCatalog[productKey];
	if (!product) {
		return <div>Product not found</div>;
	}

	/** Get and validate ratePlan */
	const ratePlanParam = searchParams.get('ratePlan');
	const ratePlanKey =
		ratePlanParam && ratePlanParam in product.ratePlans
			? ratePlanParam
			: undefined;
	const ratePlan = ratePlanKey && product.ratePlans[ratePlanKey];
	if (!ratePlan) {
		return <div>Rate plan not found</div>;
	}

	/** Get and validate the amount */
	let payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};

	const contributionParam = searchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;

	let promotion;
	if (productKey === 'Contribution') {
		if (!contributionAmount) {
			return <div>Contribution not specified</div>;
		}

		payment = {
			originalAmount: contributionAmount,
			finalAmount: contributionAmount,
		};
	} else {
		const productPrice =
			currencyKey in ratePlan.pricing
				? ratePlan.pricing[currencyKey]
				: undefined;

		if (!productPrice) {
			return <div>Price not found in product catalog</div>;
		}

		/** Get any promotions */
		const productPrices =
			productKey === 'SupporterPlus' || productKey === 'TierThree'
				? appConfig.allProductPrices[productKey]
				: undefined;

		/**
		 * This is some annoying transformation we need from
		 * Product API => Contributions work we need to do
		 */
		const billingPeriod =
			ratePlan.billingPeriod === 'Quarter'
				? 'Quarterly'
				: ratePlan.billingPeriod === 'Month'
				? 'Monthly'
				: 'Annual';

		const getFulfilmentOptions = (productKey: string): FulfilmentOptions => {
			switch (productKey) {
				case 'SupporterPlus':
				case 'Contribution':
					return 'NoFulfilmentOptions';
				case 'TierThree':
					return countryGroupId === 'International'
						? 'RestOfWorld'
						: 'Domestic';
				default:
					// ToDo: define for every product here
					return 'NoFulfilmentOptions';
			}
		};
		const fulfilmentOption = getFulfilmentOptions(productKey);

		promotion = productPrices
			? getPromotion(productPrices, countryId, billingPeriod, fulfilmentOption)
			: undefined;
		const discountedPrice = promotion?.discountedPrice
			? promotion.discountedPrice
			: undefined;

		const price = discountedPrice ?? productPrice;

		if (productKey === 'SupporterPlus') {
			/** SupporterPlus can have an additional contribution bolted onto the base price */
			payment = {
				originalAmount: productPrice,
				discountedAmount: discountedPrice,
				contributionAmount,
				finalAmount: price + (contributionAmount ?? 0),
			};
		} else {
			payment = {
				originalAmount: productPrice,
				discountedAmount: discountedPrice,
				contributionAmount,
				finalAmount: price,
			};
		}
	}
	return (
		<ThankYouComponent
			productKey={productKey}
			ratePlanKey={ratePlanKey}
			geoId={geoId}
			appConfig={appConfig}
			payment={payment}
			promotion={promotion}
		/>
	);
}

type CheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	productKey: ProductKey;
	ratePlanKey: string;
	payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	promotion?: Promotion;
};
function ThankYouComponent({
	geoId,
	productKey,
	ratePlanKey,
	payment,
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
	const isContributionProduct =
		productKey === 'Contribution' ||
		productKey === 'SupporterPlus' ||
		productKey === 'TierThree';
	const contributionType =
		isContributionProduct &&
		(ratePlanKey === 'Monthly' ||
		ratePlanKey === 'RestOfWorldMonthly' ||
		ratePlanKey === 'DomesticMonthly' ||
		ratePlanKey === 'RestOfWorldMonthlyV2' ||
		ratePlanKey === 'DomesticMonthlyV2'
			? 'MONTHLY'
			: ratePlanKey === 'Annual' ||
			  ratePlanKey === 'RestOfWorldAnnual' ||
			  ratePlanKey === 'DomesticAnnual' ||
			  ratePlanKey === 'RestOfWorldAnnualV2' ||
			  ratePlanKey === 'DomesticAnnualV2'
			? 'ANNUAL'
			: productKey === 'Contribution'
			? 'ONE_OFF'
			: undefined);

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

	const isOneOff = productKey === 'Contribution';
	const isOneOffPayPal = order.paymentMethod === 'PayPal' && isOneOff;
	const isSupporterPlus = productKey === 'SupporterPlus';
	const isTier3 = productKey === 'TierThree';
	// TODO - get this from the /identity/get-user-type endpoint
	const userTypeFromIdentityResponse = isSignedIn ? 'current' : 'new';
	const isNewAccount = userTypeFromIdentityResponse === 'new';
	const emailExists = !isNewAccount && isSignedIn;

	const productDescription = productCatalogDescription[productKey];
	const benefitsChecklist = [
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
			emailExists && !(isTier3 && showNewspaperArchiveBenefit),
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
