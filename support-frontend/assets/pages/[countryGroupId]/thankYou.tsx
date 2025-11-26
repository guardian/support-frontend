import { storage } from '@guardian/libs';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import {
	type ActiveRatePlanKey,
	isProductKey,
	productCatalog,
} from 'helpers/productCatalog';
import { toRegularBillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { logException } from 'helpers/utilities/logger';
import { roundToDecimalPlaces } from 'helpers/utilities/utilities';
import type { Participations } from '../../helpers/abTests/models';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import { setHideSupportMessaginCookie } from '../../helpers/storage/contributionsCookies';
import { getSupportRegionIdConfig } from '../supportRegionConfig';
import OnboardingComponent from './components/onboardingComponent';
import { ThankYouComponent } from './components/thankYouComponent';

const SKIP_NEW_ONBOARDING_EXPERIENCE_KEY = 'gu.skipNewOnboardingExperience';

type ThankYouProps = {
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
};

export function ThankYou({
	supportRegionId,
	appConfig,
	abParticipations,
	landingPageSettings,
}: ThankYouProps) {
	const countryId = Country.detect();
	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);

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
		if (!product) {
			logException('Product not found');
			return <div>Product not found</div>;
		}
		if (!ratePlan) {
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

			const productPrices =
				productKey === 'SupporterPlus' || productKey === 'TierThree'
					? appConfig.allProductPrices[productKey]
					: undefined;
			const billingPeriod =
				toRegularBillingPeriod(ratePlan.billingPeriod) ?? BillingPeriod.Annual;

			const getFulfilmentOptions = (productKey: string): FulfilmentOptions => {
				switch (productKey) {
					case 'TierThree':
						return countryGroupId === 'International'
							? 'RestOfWorld'
							: 'Domestic';
					default:
						return 'NoFulfilmentOptions';
				}
			};
			const fulfilmentOption = getFulfilmentOptions(productKey);

			/** Get any promotions */
			promotion = productPrices
				? getPromotion(
						productPrices,
						countryId,
						billingPeriod,
						fulfilmentOption,
				  )
				: undefined;
			const discountedPrice = promotion?.discountedPrice;
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
	}

	if (
		isSwitchOn('featureSwitches.enableThankYouOnboarding') &&
		productKey !== undefined &&
		appConfig.settings.productsWithThankYouOnboarding.includes(productKey) &&
		storage.session.get(SKIP_NEW_ONBOARDING_EXPERIENCE_KEY) !== 'true'
	) {
		return (
			<OnboardingComponent
				supportRegionId={supportRegionId}
				csrf={csrf}
				payment={payment}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				promotion={promotion}
				identityUserType={userType}
				landingPageSettings={landingPageSettings}
			/>
		);
	}

	return (
		<ThankYouComponent
			supportRegionId={supportRegionId}
			csrf={csrf}
			payment={payment}
			productKey={productKey}
			ratePlanKey={ratePlanKey}
			promotion={promotion}
			identityUserType={userType}
			abParticipations={abParticipations}
			landingPageSettings={landingPageSettings}
		/>
	);
}
