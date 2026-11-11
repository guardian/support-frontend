import { storage } from '@guardian/libs';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useEffect } from 'react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	isProductKey,
	productCatalog,
} from 'helpers/productCatalog';
import {
	billingPeriodToContributionType,
	ratePlanToBillingPeriod,
	toRegularBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import { getLegacyPromotion } from 'helpers/productPrice/legacyPromotion';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	getOrderId,
	successfulContributionConversion,
} from 'helpers/tracking/googleTagManager';
import {
	canUseMParticleConversions,
	trackMParticleConversion,
} from 'helpers/tracking/mparticleConversions';
import { getQueryParameter } from 'helpers/urls/url';
import type { UserType } from 'helpers/user/userType';
import { logException } from 'helpers/utilities/logger';
import { roundToDecimalPlaces } from 'helpers/utilities/utilities';
import { AnalyticsProfileCacheProvider } from '../../helpers/customHooks/analyticsProfileCache';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import { setHideSupportMessaginCookie } from '../../helpers/storage/contributionsCookies';
import { getSupportRegionIdConfig } from '../supportRegionConfig';
import { getThankYouOrder } from './checkout/helpers/sessionStorage';
import type { OnboardingProductKey } from './components/onboardingComponent';
import OnboardingComponent from './components/onboardingComponent';
import { ThankYouComponent } from './components/thankYouComponent';

const SKIP_NEW_ONBOARDING_EXPERIENCE_KEY = 'gu.skipNewOnboardingExperience';

type ThankYouConversionTrackingProps = {
	payment: { finalAmount: number };
	productKey?: ActiveProductKey;
	ratePlanKey?: ActiveRatePlanKey;
	currencyKey: CurrencyCode;
	mParticleConfig: AppConfig['mParticleConversions'];
};

function ThankYouConversionTracking({
	payment,
	productKey,
	ratePlanKey,
	currencyKey,
	mParticleConfig,
}: ThankYouConversionTrackingProps) {
	const { enableMParticleConversions } = useFeatureSwitches();
	const order = getThankYouOrder();
	const hasSuccessfulOrder = order?.status === 'success';
	const paymentMethod =
		order?.paymentMethod === 'StripeExpressCheckoutElement'
			? 'Stripe'
			: order?.paymentMethod;
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey ?? 'OneTime');
	const conversionProductKey = productKey ?? 'Contribution';
	const contributionType =
		billingPeriodToContributionType(billingPeriod) ?? 'MONTHLY';

	useEffect(() => {
		if (!hasSuccessfulOrder) {
			return undefined;
		}

		if (
			mParticleConfig &&
			canUseMParticleConversions(enableMParticleConversions, mParticleConfig)
		) {
			successfulContributionConversion(
				payment.finalAmount,
				contributionType,
				currencyKey,
				paymentMethod ?? 'None',
				conversionProductKey,
				'mparticle',
			);
			return trackMParticleConversion(mParticleConfig, {
				orderId: getOrderId(),
				value: payment.finalAmount,
				currency: currencyKey,
				paymentMethod: paymentMethod ?? 'None',
				contributionType:
					billingPeriod === BillingPeriod.Quarterly
						? 'QUARTERLY'
						: contributionType,
				productType: conversionProductKey,
				ratePlan: ratePlanKey ?? 'OneTime',
				billingPeriod,
			});
		}
		successfulContributionConversion(
			payment.finalAmount,
			contributionType,
			currencyKey,
			paymentMethod ?? 'None',
			conversionProductKey,
		);
		return undefined;
	}, [
		billingPeriod,
		contributionType,
		enableMParticleConversions,
		mParticleConfig,
		conversionProductKey,
		currencyKey,
		hasSuccessfulOrder,
		payment.finalAmount,
		paymentMethod,
		ratePlanKey,
	]);

	return null;
}

type ThankYouProps = {
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	landingPageSettings: LandingPageVariant;
};

export function ThankYou({
	supportRegionId,
	appConfig,
	landingPageSettings,
}: ThankYouProps) {
	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
	const { enableThankYouOnboarding } = useFeatureSwitches();

	const searchParams = new URLSearchParams(window.location.search);
	const csrf = { token: window.guardian.csrf.token };
	// product
	const productParam = searchParams.get('product');
	const productKey =
		productParam && isProductKey(productParam) ? productParam : undefined;
	const product = productKey && productCatalog[productKey];
	// ratePlan
	const ratePlanParam = searchParams.get('ratePlan');
	const ratePlanKey =
		ratePlanParam && product && ratePlanParam in product.ratePlans
			? (ratePlanParam as ActiveRatePlanKey)
			: undefined;
	const ratePlan =
		ratePlanKey && product ? product.ratePlans[ratePlanKey] : undefined;
	// contributionAmount
	const contributionParam = searchParams.get('contribution');
	const contributionAmount = contributionParam
		? roundToDecimalPlaces(parseFloat(contributionParam))
		: undefined;

	// userType: default to 'current' since it has the least specific messaging
	const userType = (searchParams.get('userType') ?? 'current') as UserType;

	let payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	let promotion: Promotion | undefined;

	if (!productParam && !ratePlanParam) {
		/* OneTime product */
		const finalAmount = contributionAmount ?? 0;
		payment = {
			originalAmount: finalAmount,
			finalAmount: finalAmount,
		};

		setHideSupportMessaginCookie();
	} else {
		/** Recurring product must have product & ratePlan */
		if (!productKey || !product) {
			logException('Product not found');
			return <div>Product not found</div>;
		}
		if (!ratePlanKey || !ratePlan) {
			logException('Rate plan not found');
			return <div>Rate plan not found</div>;
		}

		if (productKey === 'Contribution') {
			/** Recurring Contribution product must have contribution */
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

			const billingPeriod =
				toRegularBillingPeriod(ratePlan.billingPeriod) ?? BillingPeriod.Annual;

			/** Get any promotions */
			promotion = getLegacyPromotion({
				promotions: appConfig.promotions ?? [],
				productKey,
				ratePlanKey,
				price: productPrice,
				billingPeriod,
				promoCode: getQueryParameter('promoCode'),
			});

			const discountedPrice = promotion?.discountedPrice ?? undefined;
			const price = discountedPrice ?? productPrice;
			/** SupporterPlus can have an additional contribution bolted onto the base price */
			const finalAmount =
				price + (productKey === 'SupporterPlus' ? contributionAmount ?? 0 : 0);

			payment = {
				originalAmount: productPrice,
				contributionAmount,
				finalAmount,
			};
		}
	}

	const conversionTracking = (
		<ThankYouConversionTracking
			payment={payment}
			productKey={productKey}
			ratePlanKey={ratePlanKey}
			currencyKey={currencyKey}
			mParticleConfig={appConfig.mParticleConversions}
		/>
	);

	if (
		enableThankYouOnboarding &&
		productKey !== undefined &&
		appConfig.settings.productsWithThankYouOnboarding.includes(productKey) &&
		storage.session.get(SKIP_NEW_ONBOARDING_EXPERIENCE_KEY) !== 'true'
	) {
		return (
			<>
				{conversionTracking}
				<AnalyticsProfileCacheProvider>
					<OnboardingComponent
						supportRegionId={supportRegionId}
						csrf={csrf}
						payment={payment}
						productKey={productKey as OnboardingProductKey}
						ratePlanKey={ratePlanKey ?? 'OneTime'}
						promotion={promotion}
						identityUserType={userType}
						landingPageSettings={landingPageSettings}
					/>
				</AnalyticsProfileCacheProvider>
			</>
		);
	}

	return (
		<>
			{conversionTracking}
			<ThankYouComponent
				supportRegionId={supportRegionId}
				csrf={csrf}
				payment={payment}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				promotion={promotion}
				identityUserType={userType}
				landingPageSettings={landingPageSettings}
			/>
		</>
	);
}
