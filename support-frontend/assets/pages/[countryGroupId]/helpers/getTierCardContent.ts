import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import {
	type ProductOptions,
	TaxExclusive,
	TaxInclusive,
} from '@modules/product/productOptions';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	getProductLabel,
	productCatalog,
	productCatalogDescription,
} from 'helpers/productCatalog';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { buildCheckoutUrl } from 'helpers/urls/checkoutUrl';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';
import { useThreeTierUrlSelection } from 'pages/supporter-plus-landing/twoStepPages/useThreeTierUrlSelection';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import { filterProductDescriptionBenefits } from '../checkout/helpers/benefitsChecklist';
import type { TierProductKey } from './getDigitalRatePlanKey';

type TierProductKeyWithPromotion = 'SupporterPlus' | 'DigitalSubscription';

export type TierConfig = {
	countryId: CountryCode;
	tierProductKey: TierProductKey;
	supportRegionId: SupportRegionId;
	billingPeriod: BillingPeriod;
	tierRatePlanKey: ProductRatePlanKey<TierProductKey>;
	settings: LandingPageVariant;
};

export function getThreeTierProductOption(
	tierProductKey: TierProductKey,
	supportRegionId: SupportRegionId,
): ProductOptions {
	if (
		supportRegionId == SupportRegionId.CA &&
		(tierProductKey === 'DigitalSubscription' ||
			tierProductKey === 'SupporterPlus')
	) {
		return TaxExclusive;
	}
	return TaxInclusive;
}

export function getTierCardContent(config: TierConfig): CardContent {
	const {
		countryId,
		tierProductKey,
		supportRegionId,
		billingPeriod,
		tierRatePlanKey,
		settings,
	} = config;

	const fallbackProducts = fallBackLandingPageSelection.products;

	const { currencyCode, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);

	const tierPricing = productCatalog[tierProductKey]?.ratePlans[tierRatePlanKey]
		?.pricing[currencyCode] as number;

	const tierProductOption = getThreeTierProductOption(
		tierProductKey,
		supportRegionId,
	);

	const tierProductKeyWithPromotion: TierProductKeyWithPromotion | undefined =
		tierProductKey === 'SupporterPlus' ||
		tierProductKey === 'DigitalSubscription'
			? tierProductKey
			: undefined;

	const tierPromotion = tierProductKeyWithPromotion
		? getPromotion(
				allProductPrices[tierProductKeyWithPromotion],
				countryId,
				billingPeriod,
				undefined,
				tierProductOption,
		  )
		: undefined;

	const tierCheckoutURL = buildCheckoutUrl(supportRegionId, {
		product: tierProductKey,
		ratePlan: tierRatePlanKey,
		promoCode: tierPromotion?.promoCode,
	});

	const tierProductDescription = {
		...settings.products[tierProductKey],
		title: getProductLabel(tierProductKey),
		benefits:
			settings.products[tierProductKey]?.benefits ??
			filterProductDescriptionBenefits(
				productCatalogDescription[tierProductKey],
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
	const { product: urlSearchParamsProduct, selectedAmount: urlSelectedAmount } =
		useThreeTierUrlSelection();
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
		...tierProductDescription,
	};
}
