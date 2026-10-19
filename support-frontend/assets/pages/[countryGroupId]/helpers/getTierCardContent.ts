import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	getProductDescription,
	getProductLabel,
	productCatalog,
	productCatalogDescription,
} from 'helpers/productCatalog';
import { getLegacyPromotion } from 'helpers/productPrice/legacyPromotion';
import { buildCheckoutUrl } from 'helpers/urls/checkoutUrl';
import { getQueryParameter } from 'helpers/urls/url';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';
import { useThreeTierUrlSelection } from 'pages/supporter-plus-landing/twoStepPages/useThreeTierUrlSelection';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import { filterBenefits } from '../checkout/helpers/benefitsChecklist';
import type { TierProductKey } from './getDigitalRatePlanKey';

export type TierConfig = {
	countryId: CountryCode;
	tierProductKey: TierProductKey;
	supportRegionId: SupportRegionId;
	billingPeriod: RecurringBillingPeriod;
	tierRatePlanKey: ProductRatePlanKey<TierProductKey>;
	settings: LandingPageVariant;
	multipleAccountsVariant?: string;
};

export function getTierCardContent(config: TierConfig): CardContent {
	const {
		// countryId,
		tierProductKey,
		supportRegionId,
		billingPeriod,
		tierRatePlanKey,
		settings,
		multipleAccountsVariant,
	} = config;

	const fallbackProducts = fallBackLandingPageSelection.products;

	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);

	const tierPricing = productCatalog[tierProductKey]?.ratePlans[tierRatePlanKey]
		?.pricing[currencyKey] as number;

	const promotions = window.guardian.promotions ?? [];
	const promoCode = getQueryParameter('promoCode');
	const tierPromotion = getLegacyPromotion({
		promotions,
		productKey: tierProductKey,
		ratePlanKey: tierRatePlanKey,
		price: tierPricing,
		billingPeriod: billingPeriod,
		promoCode: promoCode,
	});

	const tierCheckoutURL = buildCheckoutUrl(supportRegionId, {
		product: tierProductKey,
		ratePlan: tierRatePlanKey,
		promoCode: tierPromotion?.promoCode,
	});

	const tierProductDescription = {
		...settings.products[tierProductKey],
		title: getProductLabel(tierProductKey),
		titlePill: multipleAccountsVariant
			? undefined
			: getProductDescription(tierProductKey, tierRatePlanKey).labelPill,
		benefits:
			settings.products[tierProductKey]?.benefits ??
			filterBenefits(
				productCatalogDescription[tierProductKey].benefits,
				countryGroupId,
			),
		cta:
			settings.products[tierProductKey]?.cta ??
			fallbackProducts[tierProductKey]!.cta,
		billingPeriodsCopy: settings.products[tierProductKey]?.billingPeriodsCopy,
	};

	// RRCP LandingPage Test Page / Default Product Selection
	const defaultProductSelection =
		settings.defaultProductSelection?.productType.toLowerCase();
	const { enableDeepDiscount } = useFeatureSwitches();
	const {
		productKey: urlSearchParamsProduct,
		selectedAmount: urlSelectedAmount,
	} = useThreeTierUrlSelection();
	const getDefaultProductSelection = (productKey: TierProductKey) => {
		return (
			(!urlSearchParamsProduct || enableDeepDiscount) &&
			defaultProductSelection === productKey.toLowerCase()
		);
	};

	const isCardUserSelected = (
		urlSelectedAmount: string | null,
		cardPrice: number,
		cardPriceDiscount?: number,
	): boolean => {
		const hasUrlSelectedAmount = !isNaN(Number(urlSelectedAmount));
		if (!hasUrlSelectedAmount) {
			return false;
		}
		return (
			Number(urlSelectedAmount) === cardPrice ||
			Number(urlSelectedAmount) === cardPriceDiscount
		);
	};
	const getUserSelection = (
		productKey: TierProductKey,
		productPrice: number,
		promotionAmount?: number,
	) => {
		return (
			urlSearchParamsProduct === productKey.toLowerCase() ||
			isCardUserSelected(urlSelectedAmount, productPrice, promotionAmount)
		);
	};

	return {
		product: tierProductKey,
		price: tierPricing,
		link: tierCheckoutURL,
		isDefaultProductSelected: getDefaultProductSelection(tierProductKey),
		isUserSelected: getUserSelection(
			tierProductKey,
			tierPricing,
			tierPromotion?.discount?.amount,
		),
		multipleAccountsVariant,
		...tierProductDescription,
	};
}
