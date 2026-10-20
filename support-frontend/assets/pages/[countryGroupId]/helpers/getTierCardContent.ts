import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { multipleAccountBenefitCopy } from 'helpers/abTests/multipleAccounts';
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
import {
	filterBenefits,
	removeBenefitByCopy,
} from '../checkout/helpers/benefitsChecklist';
import type { TierProductKey } from './getDigitalRatePlanKey';

export function getTierCardContent(
	supportRegionId: SupportRegionId,
	productKey: TierProductKey,
	ratePlanKey: ProductRatePlanKey<TierProductKey>,
	landingPageVariant: LandingPageVariant,
	promotion?: Promotion,
	multipleAccountsVariant?: string,
): CardContent {
	const digitalPlusMultipleAccountsVariant =
		productKey === 'DigitalSubscription' ? multipleAccountsVariant : undefined;

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

	const defaultTitle = getProductLabel(productKey);
	const title = landingPageVariant.products[productKey]?.title ?? defaultTitle;

	const defaultBenefits = filterBenefits(
		productCatalogDescription[productKey].benefits,
		countryGroupId,
	);
	const benefits =
		landingPageVariant.products[productKey]?.benefits ?? defaultBenefits;
	const benefitsFilteredByMultipleAccounts =
		digitalPlusMultipleAccountsVariant === 'V1' ||
		digitalPlusMultipleAccountsVariant === 'V2'
			? removeBenefitByCopy(benefits, multipleAccountBenefitCopy)
			: benefits;

	const tierProductDescription = {
		...landingPageVariant.products[productKey],
		title,
		titlePill: digitalPlusMultipleAccountsVariant
			? undefined
			: getProductDescription(productKey, ratePlanKey).labelPill,
		benefits: benefitsFilteredByMultipleAccounts,
		cta:
			landingPageVariant.products[productKey]?.cta ??
			fallBackLandingPageSelection.products[productKey]!.cta,
		billingPeriodsCopy:
			landingPageVariant.products[productKey]?.billingPeriodsCopy,
	};

	// RRCP LandingPage Test Page / Default Product Selection
	const defaultProductSelection =
		landingPageVariant.defaultProductSelection?.productType;
	const { enableDeepDiscount } = useFeatureSwitches();
	const { productKey: urlProductKey, selectedAmount: urlSelectedAmount } =
		useThreeTierUrlSelection();
	const getDefaultProductSelection = (productKey: TierProductKey) => {
		return (
			(!urlProductKey || enableDeepDiscount) &&
			defaultProductSelection === productKey
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
			urlProductKey === productKey ||
			isCardUserSelected(urlSelectedAmount, productPrice, promotionAmount)
		);
	};

	return {
		product: productKey,
		ratePlan: ratePlanKey,
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
