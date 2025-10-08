import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import {
	from,
	neutral,
	space,
	sport,
	until,
} from '@guardian/source/foundations';
import { Container, LinkButton } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import { getThankYouModuleData } from 'components/thankYou/thankYouModuleData';
import type { Participations } from 'helpers/abTests/models';
import { getFeatureFlags } from 'helpers/featureFlags';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import {
	billingPeriodToContributionType,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { type CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { get } from 'helpers/storage/cookie';
import {
	OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
	OPHAN_COMPONENT_ID_RETURN_TO_OBSERVER,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
import {
	sendEventCheckoutValue,
	sendEventContributionCheckoutConversion,
	sendEventOneTimeCheckoutValue,
} from 'helpers/tracking/quantumMetric';
import { getUser } from 'helpers/user/user';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';
import ThankYouHeader from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import {
	isGuardianWeeklyProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import { productDeliveryOrStartDate } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import type { BenefitsCheckListData } from '../../../components/checkoutBenefits/benefitsCheckList';
import ThankYouModules from '../../../components/thankYou/thankyouModules';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import type { ActivePaperProductOptions } from '../../../helpers/productCatalogToProductOption';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import { getPremiumDigitalAllBenefits } from '../checkout/helpers/benefitsChecklist';
import {
	getReturnAddress,
	getThankYouOrder,
} from '../checkout/helpers/sessionStorage';

const thankYouContainer = css`
	position: relative;
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;
const headerContainer = css`
	${from.desktop} {
		width: 860px;
	}
`;
const buttonContainer = css`
	position: absolute;
	bottom: ${space[8]}px;
	& > a:first-child {
		margin-right: ${space[3]}px;
	}
	${until.tablet} {
		& > a {
			margin-bottom: ${space[4]}px;
		}
	}
`;
const buttonColor = css`
	background-color: ${neutral[100]};
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

export type CheckoutComponentProps = {
	supportRegionId: SupportRegionId;
	csrf: CsrfState;
	payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	productKey?: ActiveProductKey;
	ratePlanKey?: ActiveRatePlanKey;
	promotion?: Promotion;
	identityUserType: UserType;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
};

export function ThankYouComponent({
	supportRegionId,
	csrf,
	payment,
	productKey = 'Contribution',
	ratePlanKey = 'OneTime',
	promotion,
	identityUserType,
	landingPageSettings,
}: CheckoutComponentProps) {
	const countryId = Country.fromString(get('GU_country') ?? 'GB') ?? 'GB';
	const { isSignedIn } = getUser();

	const { countryGroupId, currencyKey } =
		getSupportRegionIdConfig(supportRegionId);
	// Session storage order (from Checkout)
	const order = getThankYouOrder();
	if (!order) {
		const sessionStorageOrder = storage.session.get('thankYouOrder');
		return (
			<div>Unable to read your order {JSON.stringify(sessionStorageOrder)}</div>
		);
	}
	const isPending = order.status === 'pending';

	/**
	 * contributionType is only applicable to SupporterPlus and Contributions.
	 * We should remove it for something more generic.
	 */
	const isTier =
		productKey === 'Contribution' ||
		productKey === 'SupporterPlus' ||
		productKey === 'TierThree';
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const isOneOff = billingPeriod === BillingPeriod.OneTime;

	// track conversion with GTM
	const paymentMethod =
		order.paymentMethod === 'StripeExpressCheckoutElement'
			? 'Stripe'
			: order.paymentMethod;

	// quarterly needs support in future for GW products (when they are enabled). So not needed currently, defaults to monthly.
	successfulContributionConversion(
		payment.finalAmount, // This is the final amount after discounts
		billingPeriodToContributionType(billingPeriod) ?? 'MONTHLY',
		currencyKey,
		paymentMethod,
		productKey,
	);

	/**
	 * This is some annoying transformation we need from
	 * Product API => Contributions work we need to do
	 */
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
		billingPeriod,
		currencyKey,
	);
	const subscriptionCardProductsKey: ActiveProductKey[] = ['SubscriptionCard'];
	const paperProductsKeys: ActiveProductKey[] = [
		'NationalDelivery',
		'HomeDelivery',
	];

	const isPrint = isPrintProduct(productKey);
	const isGuardianWeekly = isGuardianWeeklyProduct(productKey);

	const getObserver = (): ObserverPrint | undefined => {
		if (paperProductsKeys.includes(productKey) && ratePlanKey === 'Sunday') {
			return ObserverPrint.Paper;
		}
		if (
			subscriptionCardProductsKey.includes(productKey) &&
			ratePlanKey === 'Sunday'
		) {
			return ObserverPrint.SubscriptionCard;
		}

		return undefined;
	};
	const observerPrint = getObserver();
	const { enablePremiumDigital } = getFeatureFlags();

	const isGuardianPrint = isPrint && !observerPrint;
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isSupporterPlus = productKey === 'SupporterPlus';
	const isTierThree = productKey === 'TierThree';
	const isNationalDelivery = productKey === 'NationalDelivery';
	const isPremiumDigital = isDigitalEdition && enablePremiumDigital;
	const { email } = order;
	const validEmail = email !== '';

	// Clarify Guardian Ad-lite thankyou page states
	const signedInUser = isSignedIn;
	const userNotSignedIn = !isSignedIn && identityUserType === 'current';
	const guestUser = !isSignedIn && identityUserType === 'new';

	const getBenefits = (): BenefitsCheckListData[] => {
		// Three Tier products get their config from the Landing Page tool
		if (isTier) {
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
		if (isPremiumDigital) {
			return getPremiumDigitalAllBenefits(countryGroupId);
		}
		return [];
	};
	const benefitsChecklist = getBenefits();

	const deliveryStart =
		order.deliveryDate ??
		productDeliveryOrStartDate(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		);
	const startDate = deliveryStart ? formatUserDate(deliveryStart) : undefined;
	const thankYouModuleData = getThankYouModuleData(
		productKey,
		ratePlanKey,
		countryGroupId,
		countryId,
		csrf,
		isOneOff,
		isSupporterPlus,
		isTierThree,
		startDate,
		email,
		undefined,
		benefitsChecklist,
		undefined,
		undefined,
		payment.finalAmount,
		getReturnAddress(), // Session storage returnAddress (from GuardianAdLiteLanding)
		isSignedIn,
		observerPrint,
	);
	const maybeThankYouModule = (
		condition: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condition ? [moduleType] : []);
	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(
			(isGuardianPrint && guestUser) ||
				(!isPending && guestUser && !isGuardianAdLite && !isGuardianPrint),
			'signUp',
		), // Complete your Guardian account
		...maybeThankYouModule(userNotSignedIn && !isGuardianAdLite, 'signIn'), // Sign in to access your benefits
		...maybeThankYouModule(isTierThree || isPremiumDigital, 'benefits'),
		...maybeThankYouModule(
			isTierThree || isNationalDelivery,
			'subscriptionStart',
		),
		...maybeThankYouModule(isGuardianAdLite || isPrint, 'whatNext'),
		...maybeThankYouModule(
			isTierThree || isSupporterPlus || (isGuardianPrint && !isGuardianWeekly),
			'appsDownload',
		),
		...maybeThankYouModule(isOneOff && validEmail, 'supportReminder'),
		...maybeThankYouModule(
			isOneOff ||
				(!(isTierThree && enablePremiumDigital) &&
					isSignedIn &&
					!isGuardianAdLite &&
					!observerPrint &&
					!isGuardianPrint),
			'feedback',
		),
		...maybeThankYouModule(isDigitalEdition, 'appDownloadEditions'),
		...maybeThankYouModule(isPremiumDigital, 'newspaperArchiveBenefit'),
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		...maybeThankYouModule(
			!isTierThree && !isGuardianAdLite && !isPrint,
			'socialShare',
		),
		...maybeThankYouModule(
			isGuardianAdLite && userNotSignedIn,
			'signInToActivate',
		),
		...maybeThankYouModule(
			isGuardianAdLite && signedInUser,
			'reminderToSignIn',
		),
		...maybeThankYouModule(
			isGuardianAdLite && guestUser,
			'reminderToActivateSubscription',
		),
		...maybeThankYouModule(
			isGuardianAdLite && (signedInUser || guestUser),
			'headlineReturn',
		),
	];
	console.log('*** ThankYouComponent.startDate', startDate);
	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					{<ThankYouFooter observerPrint={observerPrint} />}
				</FooterWithContents>
			}
		>
			<div css={thankYouContainer}>
				<Container>
					<div css={headerContainer}>
						<ThankYouHeader
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							name={order.firstName}
							amount={payment.originalAmount}
							isDirectDebitPayment={order.paymentMethod === 'DirectDebit'}
							currency={currencyKey}
							promotion={promotion}
							observerPrint={observerPrint}
							startDate={startDate}
						/>
					</div>

					<ThankYouModules
						isSignedIn={isSignedIn}
						thankYouModules={thankYouModules}
						thankYouModulesData={thankYouModuleData}
					/>

					<div css={buttonContainer}>
						{!!observerPrint && (
							<LinkButton
								href="https://www.observer.co.uk/welcome"
								priority="tertiary"
								onClick={() =>
									trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_OBSERVER)
								}
								cssOverrides={buttonColor}
							>
								Return to the Observer
							</LinkButton>
						)}
						{!isGuardianAdLite && (
							<LinkButton
								href="https://www.theguardian.com"
								priority="tertiary"
								onClick={() =>
									trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
								}
								cssOverrides={buttonColor}
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
