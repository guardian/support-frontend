import { storage } from '@guardian/libs';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { useEffect, useState } from 'react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	isProductKey,
	productCatalog,
} from 'helpers/productCatalog';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import {
	billingPeriodToContributionType,
	ratePlanToBillingPeriod,
	toRegularBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import { getPromotionDiscountedPrice } from 'helpers/productPrice/promotionPricing';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
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
import {
	getThankYouOrder,
	setThankYouOrder,
} from './checkout/helpers/sessionStorage';
import type { OnboardingProductKey } from './components/onboardingComponent';
import OnboardingComponent from './components/onboardingComponent';
import { ThankYouComponent } from './components/thankYouComponent';

const SKIP_NEW_ONBOARDING_EXPERIENCE_KEY = 'gu.skipNewOnboardingExperience';

function getSupportWorkersStatusPath(trackingUri: string): string | undefined {
	try {
		const url = new URL(trackingUri, window.location.origin);
		return url.pathname === '/support-workers/status' &&
			url.searchParams.has('jobId')
			? `${url.pathname}${url.search}`
			: undefined;
	} catch {
		return undefined;
	}
}

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
	const [order, setOrder] = useState(getThankYouOrder);
	const email = order?.email;
	const queryTransactionId = getQueryParameter('transactionId');
	const paymentStatus = getQueryParameter('paymentStatus');
	const transactionId =
		order?.transactionId ?? (queryTransactionId || undefined);
	const hasSuccessfulOrder =
		order?.status === 'success' ||
		((paymentStatus === 'success' || Boolean(queryTransactionId)) &&
			!order?.trackingUri);
	const conversionValue = order?.finalAmount ?? payment.finalAmount;
	const paymentMethod =
		order?.paymentMethod === 'StripeExpressCheckoutElement'
			? 'Stripe'
			: order?.paymentMethod ??
			  (paymentStatus === 'success' ? 'PayPal' : undefined);
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey ?? 'OneTime');
	const conversionProductKey = productKey ?? 'Contribution';
	const contributionType =
		billingPeriodToContributionType(billingPeriod) ?? 'MONTHLY';

	useEffect(() => {
		if (order?.status !== 'pending' || !order.trackingUri) {
			return undefined;
		}
		const statusPath = getSupportWorkersStatusPath(order.trackingUri);
		if (!statusPath) {
			return undefined;
		}

		let stopped = false;
		let inFlight = false;
		let timeout: number | undefined;
		let interval = 5000;
		const saveOrder = (updatedOrder: NonNullable<typeof order>) => {
			setThankYouOrder(updatedOrder);
			setOrder(updatedOrder);
		};
		const poll = async () => {
			if (stopped || inFlight) {
				return;
			}
			if (document.visibilityState === 'hidden') {
				return;
			}
			inFlight = true;
			let finished = false;
			try {
				const response = await fetch(statusPath, {
					headers: { 'Content-Type': 'application/json' },
				});
				if (!response.ok) {
					throw new Error('Could not retrieve subscription status');
				}
				const status = (await response.json()) as StatusResponse;
				if (status.status === 'success') {
					finished = true;
					saveOrder({
						...order,
						status: 'success',
						transactionId:
							typeof status.transactionId === 'string'
								? status.transactionId
								: order.transactionId,
						trackingUri: undefined,
					});
				} else if (status.status === 'failure') {
					finished = true;
					saveOrder({ ...order, trackingUri: undefined });
				}
			} catch {
				// Keep waiting while the page is open; the status endpoint can be temporarily unavailable.
			} finally {
				inFlight = false;
			}
			if (!finished && !stopped) {
				interval = Math.min(interval * 1.5, 30000);
				timeout = window.setTimeout(poll, interval);
			}
		};
		const onVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				window.clearTimeout(timeout);
				void poll();
			}
		};
		document.addEventListener('visibilitychange', onVisibilityChange);
		void poll();
		return () => {
			stopped = true;
			window.clearTimeout(timeout);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, [order]);

	useEffect(() => {
		if (!hasSuccessfulOrder) {
			return undefined;
		}
		const sendSuccessfulConversionToGtm = (source?: 'gtm' | 'mparticle') => {
			const conversionData = [
				conversionValue,
				contributionType,
				currencyKey,
				paymentMethod ?? 'None',
				conversionProductKey,
			] as const;

			successfulContributionConversion(
				...conversionData,
				source ?? 'gtm',
				transactionId,
			);
		};
		if (!transactionId) {
			sendSuccessfulConversionToGtm();
			return undefined;
		}

		if (
			mParticleConfig &&
			canUseMParticleConversions(enableMParticleConversions, mParticleConfig)
		) {
			return trackMParticleConversion(
				mParticleConfig,
				() => ({
					orderId: transactionId,
					email,
					value: conversionValue,
					currency: currencyKey,
					paymentMethod: paymentMethod ?? 'None',
					contributionType:
						billingPeriod === BillingPeriod.Quarterly
							? 'QUARTERLY'
							: contributionType,
					productType: conversionProductKey,
					ratePlan: ratePlanKey ?? 'OneTime',
					billingPeriod,
				}),
				(source) => sendSuccessfulConversionToGtm(source),
				transactionId,
			);
		}
		sendSuccessfulConversionToGtm();
		return undefined;
	}, [
		billingPeriod,
		contributionType,
		enableMParticleConversions,
		mParticleConfig,
		conversionProductKey,
		currencyKey,
		hasSuccessfulOrder,
		order,
		conversionValue,
		transactionId,
		email,
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
	let promotion: PromoWithCatalogInformation | undefined;

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
			promotion = getAppliedPromotion(
				appConfig.promotions ?? [],
				productKey,
				ratePlanKey,
				getQueryParameter('promoCode'),
			);

			const price = promotion
				? getPromotionDiscountedPrice(promotion, productPrice, billingPeriod)
				: productPrice;
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
