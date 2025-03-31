import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import { from, space, sport } from '@guardian/source/foundations';
import { Container, LinkButton } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import { getThankYouModuleData } from 'components/thankYou/thankYouModuleData';
import type { Participations } from 'helpers/abTests/models';
import type { ContributionType } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productPrice/productOptions';
import type { Promotion } from 'helpers/productPrice/promotions';
import { type CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { get } from 'helpers/storage/cookie';
import { OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN } from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
import {
	sendEventCheckoutValue,
	sendEventContributionCheckoutConversion,
	sendEventOneTimeCheckoutValue,
} from 'helpers/tracking/quantumMetric';
import { getUser } from 'helpers/user/user';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';
import ThankYouHeader from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import { productDeliveryDate } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import type { BenefitsCheckListData } from '../../../components/checkoutBenefits/benefitsCheckList';
import { ThankYouModules } from '../../../components/thankYou/thankyouModules';
import { getLandingPageVariant } from '../../../helpers/abTests/landingPageAbTests';
import { getSettings } from '../../../helpers/globalsAndSwitches/globals';
import {
	getReturnAddress,
	getThankYouOrder,
} from '../checkout/helpers/sessionStorage';

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

export type CheckoutComponentProps = {
	geoId: GeoId;
	csrf: CsrfState;
	payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	productKey?: ActiveProductKey;
	ratePlanKey?: string;
	promotion?: Promotion;
	identityUserType: UserType;
	abParticipations: Participations;
};

export function ThankYouComponent({
	geoId,
	csrf,
	payment,
	productKey = 'Contribution',
	ratePlanKey,
	promotion,
	identityUserType,
	abParticipations,
}: CheckoutComponentProps) {
	const countryId = Country.fromString(get('GU_country') ?? 'GB') ?? 'GB';
	const user = getUser();
	const isSignedIn = user.isSignedIn;

	const { countryGroupId, currencyKey } = getGeoIdConfig(geoId);
	// Session storage order (from Checkout)
	const order = getThankYouOrder();
	if (!order) {
		const sessionStorageOrder = storage.session.get('thankYouOrder');
		return (
			<div>Unable to read your order {JSON.stringify(sessionStorageOrder)}</div>
		);
	}
	// TESTING TO REMOVE THIS
	//const isPending = false;
	const isPending = order.status === 'pending';

	/**
	 * contributionType is only applicable to SupporterPlus and Contributions.
	 * We should remove it for something more generic.
	 */
	const isTier =
		productKey === 'Contribution' ||
		productKey === 'SupporterPlus' ||
		productKey === 'TierThree';
	let contributionType: ContributionType;
	switch (ratePlanKey) {
		case 'Monthly':
		case 'RestOfWorldMonthly':
		case 'DomesticMonthly':
		case 'RestOfWorldMonthlyV2':
		case 'DomesticMonthlyV2':
		case 'Everyday':
		case 'Sixday':
		case 'Weekend':
		case 'Saturday':
		case 'Sunday':
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
			// A one-off contribution indicated by the absence of product and ratePlan
			contributionType = 'ONE_OFF';
			break;
	}

	const isOneOff = contributionType === 'ONE_OFF';

	// track conversion with GTM
	const paymentMethod =
		order.paymentMethod === 'StripeExpressCheckoutElement'
			? 'Stripe'
			: order.paymentMethod;

	successfulContributionConversion(
		payment.finalAmount, // This is the final amount after discounts
		contributionType,
		currencyKey,
		paymentMethod,
		productKey,
	);

	/**
	 * This is some annoying transformation we need from
	 * Product API => Contributions work we need to do
	 */
	const billingPeriod = contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	if (isOneOff) {
		// track conversion with QM
		sendEventOneTimeCheckoutValue(
			payment.originalAmount, // This is the amount before discounts
			currencyKey,
			true,
		);
	} else {
		// track conversion with QM
		sendEventCheckoutValue(
			payment.originalAmount, // This is the amount before discounts
			productKey,
			billingPeriod,
			currencyKey,
			true,
		);
	}

	// track conversion with QM
	sendEventContributionCheckoutConversion(
		payment.originalAmount, // This is the amount before discounts
		contributionType,
		currencyKey,
	);

	const paperProductsKeys: ActiveProductKey[] = [
		'NationalDelivery',
		'HomeDelivery',
		'SubscriptionCard',
	];
	const printProductsKeys: ActiveProductKey[] = [
		...paperProductsKeys,
		'GuardianWeeklyDomestic',
		'GuardianWeeklyRestOfWorld',
	];
	const isPrint = printProductsKeys.includes(productKey);
	const isObserverPaper =
		paperProductsKeys.includes(productKey) && ratePlanKey === 'Sunday';
	const isGuardianPrint =
		printProductsKeys.includes(productKey) && ratePlanKey !== 'Sunday';
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isOneOffPayPal = order.paymentMethod === 'PayPal' && isOneOff;
	const isSupporterPlus = productKey === 'SupporterPlus';
	const isTier3 = productKey === 'TierThree';
	const validEmail = order.email !== '';
	const showNewspaperArchiveBenefit = ['v1', 'v2', 'control'].includes(
		abParticipations.newspaperArchiveBenefit ?? '',
	);

	// Clarify Guardian Ad-lite thankyou page states
	// TESTING TO REMOVE THIS
	//const isNotRegistered = false;
	const isNotRegistered = identityUserType === 'new';
	const isRegisteredAndSignedIn = !isNotRegistered && isSignedIn;
	const isRegisteredAndNotSignedIn = !isNotRegistered && !isSignedIn;

	const getBenefits = (): BenefitsCheckListData[] => {
		// Three Tier products get their config from the Landing Page tool
		if (isTier) {
			const landingPageSettings = getLandingPageVariant(
				abParticipations,
				getSettings().landingPageTests,
			);
			// Also show SupporterPlus benefits for TierThree
			const tierThreeAdditionalBenefits =
				productKey === 'TierThree'
					? landingPageSettings.products.SupporterPlus.benefits.map(
							(benefit) => ({
								isChecked: true,
								text: benefit.copy,
							}),
					  )
					: [];
			return [
				...landingPageSettings.products[productKey].benefits.map((benefit) => ({
					isChecked: true,
					text: benefit.copy,
				})),
				...tierThreeAdditionalBenefits,
			];
		}
		return [];
	};

	const benefitsChecklist = getBenefits();

	const deliveryDate = productDeliveryDate(
		productKey,
		ratePlanKey as ActivePaperProductOptions,
	);
	const startDate = deliveryDate ? formatUserDate(deliveryDate) : '';

	const thankYouModuleData = getThankYouModuleData(
		productKey,
		countryGroupId,
		countryId,
		csrf,
		isOneOff,
		isSupporterPlus,
		startDate,
		undefined,
		undefined,
		isTier3,
		benefitsChecklist,
		undefined,
		undefined,
		payment.finalAmount,
		getReturnAddress(), // Session storage returnAddress (from GuardianAdLiteLanding)
		isSignedIn,
	);
	const maybeThankYouModule = (
		condition: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condition ? [moduleType] : []);
	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(
			!isPending && isNotRegistered && !isGuardianAdLite,
			'signUp',
		), // Complete your Guardian account
		...maybeThankYouModule(
			isRegisteredAndNotSignedIn && !isGuardianAdLite,
			'signIn',
		), // Sign in to access your benefits
		...maybeThankYouModule(isTier3, 'benefits'),
		...maybeThankYouModule(
			isTier3 && showNewspaperArchiveBenefit,
			'newspaperArchiveBenefit',
		),
		...maybeThankYouModule(isTier3 || isGuardianPrint, 'subscriptionStart'),
		...maybeThankYouModule(isTier3 || isSupporterPlus, 'appsDownload'),
		...maybeThankYouModule(isOneOff && validEmail, 'supportReminder'),
		...maybeThankYouModule(
			isOneOff ||
				(!(isTier3 && showNewspaperArchiveBenefit) &&
					isSignedIn &&
					!isGuardianAdLite),
			'feedback',
		),
		...maybeThankYouModule(isDigitalEdition, 'appDownloadEditions'),
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		...maybeThankYouModule(
			!isTier3 && !isGuardianAdLite && !isPrint,
			'socialShare',
		),
		...maybeThankYouModule(isGuardianAdLite || isObserverPaper, 'whatNext'), // All
		...maybeThankYouModule(
			isGuardianAdLite && isRegisteredAndNotSignedIn,
			'signInToActivate',
		),
		...maybeThankYouModule(
			isGuardianAdLite && isRegisteredAndSignedIn,
			'reminderToSignIn',
		),
		...maybeThankYouModule(
			isGuardianAdLite && isNotRegistered,
			'reminderToActivateSubscription',
		),
		...maybeThankYouModule(
			isGuardianAdLite && (isRegisteredAndSignedIn || isNotRegistered),
			'headlineReturn',
		),
	];

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
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							name={order.firstName}
							amount={payment.originalAmount}
							contributionType={contributionType}
							amountIsAboveThreshold={isSupporterPlus}
							isOneOffPayPal={isOneOffPayPal}
							showDirectDebitMessage={order.paymentMethod === 'DirectDebit'}
							currency={currencyKey}
							promotion={promotion}
							identityUserType={identityUserType}
							paymentStatus={order.status}
							startDate={startDate}
						/>
					</div>

					<ThankYouModules
						isSignedIn={isSignedIn}
						showNewspaperArchiveBenefit={showNewspaperArchiveBenefit}
						thankYouModules={thankYouModules}
						thankYouModulesData={thankYouModuleData}
					/>

					<div css={buttonContainer}>
						{!isGuardianAdLite && (
							<LinkButton
								href="https://www.theguardian.com"
								priority="tertiary"
								onClick={() =>
									trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
								}
							>
								Return to the Guardian
							</LinkButton>
						)}
					</div>
				</Container>
			</div>
		</PageScaffold>
	);
}
