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
	supportRegionId: SupportRegionId;
	tierProductKey: TierProductKey;
	tierRatePlanKey: ProductRatePlanKey<TierProductKey>;
	billingPeriod: RecurringBillingPeriod;
	landingPageVariant: LandingPageVariant;
	multipleAccountsVariant?: string;
};

export function getTierCardContent(config: TierConfig): CardContent {
	const {
		supportRegionId,
		tierProductKey: productKey,
		tierRatePlanKey,
		billingPeriod,
		landingPageVariant,
		multipleAccountsVariant,
	} = config;

	const defaultLandingPageVariant = fallBackLandingPageSelection.products;

	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);

	const price = productCatalog[productKey]?.ratePlans[tierRatePlanKey]?.pricing[
		currencyKey
	] as number;

	const promotions = window.guardian.promotions ?? [];
	const promoCode = getQueryParameter('promoCode');
	const tierPromotion = getLegacyPromotion({
		promotions,
		productKey: productKey,
		ratePlanKey: tierRatePlanKey,
		price,
		billingPeriod: billingPeriod,
		promoCode: promoCode,
	});

	const tierCheckoutURL = buildCheckoutUrl(supportRegionId, {
		product: productKey,
		ratePlan: tierRatePlanKey,
		promoCode: tierPromotion?.promoCode,
	});

	const tierProductDescription = {
		...landingPageVariant.products[productKey],
		title: getProductLabel(productKey),
		titlePill: multipleAccountsVariant
			? undefined
			: getProductDescription(productKey, tierRatePlanKey).labelPill,
		benefits:
			landingPageVariant.products[productKey]?.benefits ??
			filterBenefits(
				productCatalogDescription[productKey].benefits,
				countryGroupId,
			),
		cta:
			landingPageVariant.products[productKey]?.cta ??
			defaultLandingPageVariant[productKey]!.cta,
		billingPeriodsCopy:
			landingPageVariant.products[productKey]?.billingPeriodsCopy,
	};

	// RRCP LandingPage Test Page / Default Product Selection
	const defaultProductSelection =
		landingPageVariant.defaultProductSelection?.productType.toLowerCase();
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
		product: productKey,
		price,
		link: tierCheckoutURL,
		isDefaultProductSelected: getDefaultProductSelection(productKey),
		isUserSelected: getUserSelection(
			productKey,
			price,
			tierPromotion?.discount?.amount,
		),
		multipleAccountsVariant,
		...tierProductDescription,
	};
}
