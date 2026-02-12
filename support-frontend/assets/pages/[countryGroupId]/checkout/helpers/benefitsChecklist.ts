import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { getPlanBenefitData } from 'pages/paper-subscription-landing/planData';
import type { BenefitsCheckListData } from '../../../../components/checkoutBenefits/benefitsCheckList';
import type { Participations } from '../../../../helpers/abTests/models';
import type { LandingPageVariant } from '../../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	filterBenefitByABTest,
	filterBenefitByRegion,
	productCatalogDescription,
} from '../../../../helpers/productCatalog';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
	ProductBenefit,
	ProductDescription,
} from '../../../../helpers/productCatalog';

export const getPaperPlusDigitalBenefits = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): BenefitsCheckListData[] | undefined => {
	switch (productKey) {
		case 'HomeDelivery':
		case 'SubscriptionCard':
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return getPlanBenefitData(productKey, ratePlanKey);
		default:
			return undefined;
	}
};

const benefitsAsChecklist = ({
	checked,
	unchecked,
}: {
	checked: ProductBenefit[];
	unchecked: ProductBenefit[];
}): BenefitsCheckListData[] => {
	return [
		...checked.map((benefit) => ({
			isChecked: true,
			text: benefit.copy,
		})),
		...unchecked.map((benefit) => ({
			isChecked: false,
			text: benefit.copy,
			maybeGreyedOut: css`
				color: ${palette.neutral[60]};
				svg {
					fill: ${palette.neutral[60]};
				}
			`,
		})),
	];
};

export const getBenefitsChecklistFromLandingPageTool = (
	productKey: ProductKey,
	landingPageSettings: LandingPageVariant,
	countryGroupId: CountryGroupId,
): BenefitsCheckListData[] | undefined => {
	// Three Tier products get their config from the Landing Page tool
	if (productKey === 'Contribution') {
		// Also show SupporterPlus benefits greyed out
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.Contribution?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription.Contribution,
					countryGroupId,
				),
			unchecked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription.SupporterPlus,
					countryGroupId,
				),
		});
	} else if (productKey === 'SupporterPlus') {
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription.SupporterPlus,
					countryGroupId,
				),
			unchecked: [],
		});
	} else if (productKey === 'DigitalSubscription') {
		return benefitsAsChecklist({
			checked: [
				...(landingPageSettings.products.DigitalSubscription?.benefits ??
					filterProductDescriptionBenefits(
						productCatalogDescription.DigitalSubscription,
						countryGroupId,
					)),
				...(landingPageSettings.products.SupporterPlus?.benefits ??
					filterProductDescriptionBenefits(
						productCatalogDescription.SupporterPlus,
						countryGroupId,
					)),
			],
			unchecked: [],
		});
	}
	return;
};

export const getBenefitsChecklistFromProductDescription = (
	productDescription: ProductDescription,
	countryGroupId: CountryGroupId,
	abParticipations: Participations,
): BenefitsCheckListData[] => {
	return productDescription.benefits
		.filter((benefit) => filterBenefitByRegion(benefit, countryGroupId))
		.filter((benefit) => filterBenefitByABTest(benefit, abParticipations))
		.map((benefit) => ({
			isChecked: true,
			text: `${benefit.copyBoldStart ?? ''}${benefit.copy}`,
		}));
};

export const filterProductDescriptionBenefits = (
	productDescription: ProductDescription,
	countryGroupId: CountryGroupId,
): ProductBenefit[] => {
	return productDescription.benefits.filter((benefit) =>
		filterBenefitByRegion(benefit, countryGroupId),
	);
};
