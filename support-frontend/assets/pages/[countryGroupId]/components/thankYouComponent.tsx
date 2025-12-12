import { css, ThemeProvider } from '@emotion/react';
import { storage } from '@guardian/libs';
import { from } from '@guardian/source/foundations';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import ObserverPageLayout from 'components/observer-layout/ObserverPageLayout';
import { observerThemeButton } from 'components/observer-layout/styles';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import { getThankYouModuleData } from 'components/thankYou/thankYouModuleData';
import type { Participations } from 'helpers/abTests/models';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import { Country } from 'helpers/internationalisation/classes/country';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import {
	billingPeriodToContributionType,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { type CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { get } from 'helpers/storage/cookie';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
import {
	sendEventCheckoutValue,
	sendEventContributionCheckoutConversion,
	sendEventOneTimeCheckoutValue,
} from 'helpers/tracking/quantumMetric';
import { getUser } from 'helpers/user/user';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getProductFirstDeliveryDate } from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import { isPaperPlusSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import ThankYouHeader from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import {
	isGuardianWeeklyProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import type { BenefitsCheckListData } from '../../../components/checkoutBenefits/benefitsCheckList';
import ThankYouModules from '../../../components/thankYou/thankyouModules';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import type { ActivePaperProductOptions } from '../../../helpers/productCatalogToProductOption';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import {
	filterProductDescriptionBenefits,
	getPaperPlusDigitalBenefits,
} from '../checkout/helpers/benefitsChecklist';
import {
	getReturnAddress,
	getThankYouOrder,
} from '../checkout/helpers/sessionStorage';
import getObserver from '../helpers/getObserver';
import GuardianPageLayout from './GuardianPageLayout';
import ThankYouNavLinks from './ThankYouNavLinks';

const headerContainer = css`
	${from.desktop} {
		width: 860px;
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
		productKey === 'DigitalSubscription';
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

	const isGuardianPaperPlus = isPaperPlusSub(productKey, ratePlanKey); // Observer not a Plus plan
	const isPrint = isPrintProduct(productKey);
	const isGuardianWeekly = isGuardianWeeklyProduct(productKey);

	const observerPrint = getObserver(productKey, ratePlanKey);
	const isObserverSubDomain = isObserverSubdomain();

	const isGuardianPrint = isPrint && !observerPrint;
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isSupporterPlus = productKey === 'SupporterPlus';
	const isTierThree = productKey === 'TierThree';
	const isNationalDelivery = productKey === 'NationalDelivery';
	const { email } = order;
	const validEmail = email !== '';

	// Clarify Guardian Ad-lite thankyou page states
	const { isSignedIn } = getUser();
	const userNotSignedIn = !isSignedIn && identityUserType === 'current';
	const guestUser = !isSignedIn && identityUserType === 'new';

	const getBenefits = (): BenefitsCheckListData[] => {
		// Three Tier products get their config from the Landing Page tool
		if (isTier) {
			const productBenefits = (
				landingPageSettings.products[productKey]?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription[productKey],
					countryGroupId,
				)
			).map((benefit) => ({
				isChecked: true,
				text: benefit.copy,
			}));
			const digitalSubscriptionAdditionalBenefits =
				productKey === 'DigitalSubscription'
					? (
							landingPageSettings.products.SupporterPlus?.benefits ??
							filterProductDescriptionBenefits(
								productCatalogDescription.SupporterPlus,
								countryGroupId,
							)
					  ).map((benefit) => ({
							isChecked: true,
							text: benefit.copy,
					  }))
					: [];
			return [...productBenefits, ...digitalSubscriptionAdditionalBenefits];
		}
		if (isGuardianPaperPlus || !!observerPrint) {
			return getPaperPlusDigitalBenefits(productKey, ratePlanKey) ?? [];
		}
		return [];
	};
	const benefitsChecklist = getBenefits();

	const deliveryStart =
		order.deliveryDate ??
		getProductFirstDeliveryDate(
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
				(!isPending &&
					guestUser &&
					!isGuardianAdLite &&
					!isGuardianPrint &&
					!isObserverSubDomain),
			'signUp',
		), // Complete your Guardian account
		...maybeThankYouModule(
			userNotSignedIn && !isGuardianAdLite && !isObserverSubDomain,
			'signIn',
		), // Sign in to access your benefits
		...maybeThankYouModule(isTierThree || isDigitalEdition, 'benefits'),
		...maybeThankYouModule(
			!!isObserverSubDomain && !!observerPrint,
			'observerAppDownload',
		),
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
			isOneOff || (!isTierThree && isSignedIn && !isGuardianAdLite && !isPrint),
			'feedback',
		),
		...maybeThankYouModule(isDigitalEdition, 'appDownloadEditions'),
		...maybeThankYouModule(
			isDigitalEdition || isGuardianPaperPlus,
			'newspaperArchiveBenefit',
		),
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		...maybeThankYouModule(
			!isTierThree && !isGuardianAdLite && !isPrint && !isDigitalEdition,
			'socialShare',
		),
		...maybeThankYouModule(
			isGuardianAdLite && userNotSignedIn,
			'signInToActivate',
		),
		...maybeThankYouModule(isGuardianAdLite && isSignedIn, 'reminderToSignIn'),
		...maybeThankYouModule(
			isGuardianAdLite && guestUser,
			'reminderToActivateSubscription',
		),
		...maybeThankYouModule(
			isGuardianAdLite && (isSignedIn || guestUser),
			'headlineReturn',
		),
	];

	const PageLayout = isObserverSubdomain()
		? ObserverPageLayout
		: GuardianPageLayout;

	const theme = {
		...(isObserverSubdomain() && { observerThemeButton }),
	};

	return (
		<ThemeProvider theme={theme}>
			<PageLayout observerPrint={observerPrint} borderBox={false} noFooterLinks>
				<div>
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

					<ThankYouNavLinks productKey={productKey} ratePlanKey={ratePlanKey} />
				</div>
			</PageLayout>
		</ThemeProvider>
	);
}
