import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import type { BenefitsCheckListData } from '../../../../components/checkoutBenefits/benefitsCheckList';
import type { Participations } from '../../../../helpers/abTests/models';
import type { LandingPageVariant } from '../../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	filterBenefitByABTest,
	filterBenefitByRegion,
	productCatalogDescription,
} from '../../../../helpers/productCatalog';
import type {
	ProductBenefit,
	ProductDescription,
} from '../../../../helpers/productCatalog';

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
	supportRegionId: SupportRegionId,
): BenefitsCheckListData[] | undefined => {
	// Tier products get their config from the Landing Page tool
	if (productKey === 'Contribution') {
		// Also show SupporterPlus benefits greyed out
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.Contribution?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription.Contribution,
					supportRegionId,
				),
			unchecked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription.SupporterPlus,
					supportRegionId,
				),
		});
	} else if (productKey === 'SupporterPlus') {
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterProductDescriptionBenefits(
					productCatalogDescription.SupporterPlus,
					supportRegionId,
				),
			unchecked: [],
		});
	} else if (productKey === 'DigitalSubscription') {
		return benefitsAsChecklist({
			checked: [
				...(landingPageSettings.products.DigitalSubscription?.benefits ??
					filterProductDescriptionBenefits(
						productCatalogDescription.DigitalSubscription,
						supportRegionId,
					)),
				...(landingPageSettings.products.SupporterPlus?.benefits ??
					filterProductDescriptionBenefits(
						productCatalogDescription.SupporterPlus,
						supportRegionId,
					)),
			],
			unchecked: [],
		});
	}
	return;
};

export const getBenefitsChecklistFromProductDescription = (
	productDescription: ProductDescription,
	supportRegionId: SupportRegionId,
	abParticipations: Participations,
): BenefitsCheckListData[] => {
	return productDescription.benefits
		.filter((benefit) => filterBenefitByRegion(benefit, supportRegionId))
		.filter((benefit) => filterBenefitByABTest(benefit, abParticipations))
		.map((benefit) => ({
			isChecked: true,
			text: `${benefit.copyBoldStart ?? ''}${benefit.copy}`,
		}));
};

export const filterProductDescriptionBenefits = (
	productDescription: ProductDescription,
	supportRegionId: SupportRegionId,
): ProductBenefit[] => {
	return productDescription.benefits.filter((benefit) =>
		filterBenefitByRegion(benefit, supportRegionId),
	);
};
