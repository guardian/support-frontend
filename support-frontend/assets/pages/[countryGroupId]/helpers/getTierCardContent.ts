import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
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
import type { Promotion } from 'helpers/productPrice/promotions';
import { buildCheckoutUrl } from 'helpers/urls/checkoutUrl';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';
import { useThreeTierUrlSelection } from 'pages/supporter-plus-landing/twoStepPages/useThreeTierUrlSelection';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import { filterBenefits } from '../checkout/helpers/benefitsChecklist';
import type { TierProductKey } from './getDigitalRatePlanKey';

export type TierConfig = {
	supportRegionId: SupportRegionId;
	productKey: TierProductKey;
	ratePlanKey: ProductRatePlanKey<TierProductKey>;
	landingPageVariant: LandingPageVariant;
	promotion?: Promotion;
	multipleAccountsVariant?: string;
};

export function getTierCardContent(config: TierConfig): CardContent {
	const {
		supportRegionId,
		productKey,
		ratePlanKey,
		landingPageVariant,
		promotion,
		multipleAccountsVariant,
	} = config;

	const defaultLandingPageVariant = fallBackLandingPageSelection.products;

	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);

	const price = productCatalog[productKey]?.ratePlans[ratePlanKey]?.pricing[
		currencyKey
	] as number;

	const tierCheckoutURL = buildCheckoutUrl(supportRegionId, {
		product: productKey,
		ratePlan: ratePlanKey,
		promoCode: promotion?.promoCode,
	});

	const tierProductDescription = {
		...landingPageVariant.products[productKey],
		title: getProductLabel(productKey),
		titlePill: multipleAccountsVariant
			? undefined
			: getProductDescription(productKey, ratePlanKey).labelPill,
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
			promotion?.discount?.amount,
		),
		promotion,
		multipleAccountsVariant,
		...tierProductDescription,
	};
}
