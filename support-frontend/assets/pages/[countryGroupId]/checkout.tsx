import { ThemeProvider } from '@emotion/react';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { type ProductOptions } from '@modules/product/productOptions';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import ObserverPageLayout from 'components/observer-layout/ObserverPageLayout';
import { observerThemeButton } from 'components/observer-layout/styles';
import {
	getStripeKeyForCountry,
	getStripeKeyForProduct,
} from 'helpers/forms/stripe';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	isProductKey,
	productCatalog,
} from 'helpers/productCatalog';
import { toRegularBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getPromotion } from 'helpers/productPrice/promotions';
import * as cookie from 'helpers/storage/cookie';
import { getLowerProductBenefitThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { sendEventCheckoutValue } from 'helpers/tracking/quantumMetric';
import { logException } from 'helpers/utilities/logger';
import { getProductWeeklyDeliveryDate } from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import type { CheckoutNudgeSettings } from '../../helpers/abTests/checkoutNudgeAbTests';
import type { Participations } from '../../helpers/abTests/models';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import type { LegacyProductType } from '../../helpers/legacyTypeConversions';
import { getLegacyProductType } from '../../helpers/legacyTypeConversions';
import { getFulfilmentOptionFromProductKey } from '../../helpers/productCatalogToFulfilmentOption';
import { getProductOptionFromProductAndRatePlan } from '../../helpers/productCatalogToProductOption';
import { getSupportRegionIdConfig } from '../supportRegionConfig';
import { useStripeHostedCheckoutSession } from './checkout/hooks/useStripeHostedCheckoutSession';
import CheckoutForm from './components/checkoutForm';
import CheckoutSummary from './components/checkoutSummary';
import GuardianPageLayout from './components/GuardianPageLayout';
import { getStudentDiscount } from './student/helpers/discountDetails';

type Props = {
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
	nudgeSettings?: CheckoutNudgeSettings;
};

const countryId: IsoCountry = Country.detect();

const getPromotionFromProductPrices = (
	appConfig: AppConfig,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	countryId: IsoCountry,
	billingPeriod: BillingPeriod,
) => {
	/**
	 * Get any promotions.
	 * These come from the productPrices object for the particular product on window.guardian.
	 */
	const productPriceKey: LegacyProductType = getLegacyProductType(
		productKey,
		ratePlanKey,
	);

	const productPrices = appConfig.allProductPrices[productPriceKey];

	if (productPrices === undefined) {
		return undefined;
	}

	const fulfilmentOption = getFulfilmentOptionFromProductKey(productKey);
	const productOptions: ProductOptions = getProductOptionFromProductAndRatePlan(
		productKey,
		ratePlanKey,
	);

	return getPromotion(
		productPrices,
		countryId,
		billingPeriod,
		fulfilmentOption,
		productOptions,
	);
};

export function Checkout({
	supportRegionId,
	appConfig,
	abParticipations,
	landingPageSettings,
	nudgeSettings,
}: Props) {
	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
	const urlSearchParams = new URLSearchParams(window.location.search);

	/** 👇 a lot of this is copy/pasted into the thank you page */
	/** Get and validate product */
	const productParam = urlSearchParams.get('product');
	const productKey =
		productParam && isProductKey(productParam) ? productParam : undefined;
	const product = productKey && productCatalog[productKey];
	if (!product) {
		logException('Product not found');
		return <div>Product not found</div>;
	}

	/** Get and validate active ratePlan */
	const ratePlanParam = urlSearchParams.get('ratePlan');
	const ratePlanKey =
		ratePlanParam && ratePlanParam in product.ratePlans
			? (ratePlanParam as ActiveRatePlanKey)
			: undefined;
	const ratePlan = ratePlanKey && product.ratePlans[ratePlanKey];
	if (!ratePlan) {
		logException('Rate plan not found');
		return <div>Rate plan not found</div>;
	}

	/**
	 * Get and validate the amount
	 *
	 * For products the amount is based on
	 * - the product price in the catalog
	 * - any promotions applied
	 * - any contributions made
	 */

	/**
	 * - `originalAmount` the amount pre any discounts or contributions
	 * - `discountedAmount` the amount with a discountApplied
	 * - `finalAmount` is the amount a person will pay
	 */
	let payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};

	const contributionParam = urlSearchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;
	const billingPeriod =
		toRegularBillingPeriod(ratePlan.billingPeriod) ?? BillingPeriod.Annual;

	let promotion;
	if (productKey === 'Contribution') {
		// Use the amount from the url if provided, otherwise use the product catalog amount
		const amount =
			contributionAmount ?? (ratePlan.pricing[currencyKey] as number);

		payment = {
			contributionAmount: amount,
			originalAmount: amount,
			finalAmount: amount,
		};
	} else {
		const productPrice =
			currencyKey in ratePlan.pricing
				? ratePlan.pricing[currencyKey]
				: undefined;

		if (!productPrice) {
			logException('Price not found in product catalog');
			return <div>Price not found in product catalog</div>;
		}

		promotion = getPromotionFromProductPrices(
			appConfig,
			productKey,
			ratePlanKey,
			countryId,
			billingPeriod,
		);

		const discountedPrice = promotion?.discountedPrice ?? undefined;

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

	const isTestUser = !!cookie.get('_test_username');
	const stripePublicKey =
		getStripeKeyForProduct('REGULAR', productKey, ratePlanKey, isTestUser) ??
		getStripeKeyForCountry('REGULAR', countryId, currencyKey, isTestUser);
	const stripePromise = loadStripe(stripePublicKey);

	const stripeExpressCheckoutSwitch =
		window.guardian.settings.switches.recurringPaymentMethods
			.stripeExpressCheckout === 'On';

	let elementsOptions = {};
	let useStripeExpressCheckout = false;
	if (stripeExpressCheckoutSwitch) {
		/**
		 * Currently we're only using the stripe ExpressCheckoutElement (Google and Apple Pay) for some
		 * product types - those which don't need an address. This requires some extra configuration.
		 */
		if (
			productKey === 'Contribution' ||
			productKey === 'SupporterPlus' ||
			productKey === 'GuardianAdLite' ||
			productKey === 'DigitalSubscription'
		) {
			elementsOptions = {
				mode: 'subscription',
				/**
				 * Stripe amounts are in the "smallest currency unit"
				 * @see https://docs.stripe.com/api/charges/object
				 * @see https://docs.stripe.com/currencies#zero-decimal
				 */
				amount: payment.finalAmount * 100,
				currency: currencyKey.toLowerCase(),
				paymentMethodCreation: 'manual',
			} as const;
			useStripeExpressCheckout = true;
		}
	}

	/**
	 * We use the country ULRSearchParam to force a person into a country.
	 * Where this is currently used is in the addressFields when someone selects
	 * a country that doesn't correspond to the countryGroup a product is in.
	 */
	const forcedCountry = urlSearchParams.get('country') ?? undefined;

	useEffect(() => {
		/**
		 * Notify QM of checkout value
		 */
		sendEventCheckoutValue(
			payment.finalAmount,
			productKey,
			billingPeriod,
			currencyKey,
		);
	}, []);

	const checkoutSessionIdUrlParam = 'checkoutSessionId';
	const maybeCheckoutSessionId = urlSearchParams.get(checkoutSessionIdUrlParam);

	const [checkoutSession, clearCheckoutSession] =
		useStripeHostedCheckoutSession(maybeCheckoutSessionId);

	const [weeklyDeliveryDate, setWeeklyDeliveryDate] = useState<Date>(
		getProductWeeklyDeliveryDate(productKey),
	);

	/**
	 * Passed down because minimum product prices are unavailable in the paymentTsAndCs story
	 * and shared across summary and form checkout sub-components
	 */
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);
	const thresholdAmount = getLowerProductBenefitThreshold(
		billingPeriod,
		fromCountryGroupId(countryGroupId),
		countryGroupId,
		productKey,
		ratePlanKey,
	);

	/**
	 * Non-AU Students have ratePlanKey as OneYearStudent
	 * AU Students have ratePlanKey as Monthly, productKey as SupporterPlus
	 * and required promoCode UTS_STUDENT
	 */
	const studentDiscount = getStudentDiscount(
		supportRegionId,
		ratePlanKey,
		productKey,
		promotion,
		true,
	);

	const PageLayout = isObserverSubdomain()
		? ObserverPageLayout
		: GuardianPageLayout;

	const theme = {
		...(isObserverSubdomain() && { observerThemeButton }),
	};

	return (
		<ThemeProvider theme={theme}>
			<Elements stripe={stripePromise} options={elementsOptions}>
				<PageLayout borderBox>
					<CheckoutSummary
						supportRegionId={supportRegionId}
						appConfig={appConfig}
						productKey={productKey}
						ratePlanKey={ratePlanKey}
						promotion={promotion}
						originalAmount={payment.originalAmount}
						countryId={countryId}
						forcedCountry={forcedCountry}
						abParticipations={abParticipations}
						landingPageSettings={landingPageSettings}
						weeklyDeliveryDate={weeklyDeliveryDate}
						thresholdAmount={thresholdAmount}
						studentDiscount={studentDiscount}
						nudgeSettings={nudgeSettings}
					/>

					<CheckoutForm
						supportRegionId={supportRegionId}
						appConfig={appConfig}
						stripePublicKey={stripePublicKey}
						isTestUser={isTestUser}
						productKey={productKey}
						ratePlanKey={ratePlanKey}
						promotion={promotion}
						originalAmount={payment.originalAmount}
						discountedAmount={payment.discountedAmount}
						contributionAmount={payment.contributionAmount}
						finalAmount={payment.finalAmount}
						useStripeExpressCheckout={useStripeExpressCheckout}
						countryId={countryId}
						forcedCountry={forcedCountry}
						abParticipations={abParticipations}
						landingPageSettings={landingPageSettings}
						checkoutSession={checkoutSession}
						clearCheckoutSession={clearCheckoutSession}
						weeklyDeliveryDate={weeklyDeliveryDate}
						setWeeklyDeliveryDate={setWeeklyDeliveryDate}
						thresholdAmount={thresholdAmount}
						studentDiscount={studentDiscount}
					/>
				</PageLayout>
			</Elements>
		</ThemeProvider>
	);
}
