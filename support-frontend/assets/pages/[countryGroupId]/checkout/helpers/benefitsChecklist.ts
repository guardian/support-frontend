import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import type { BenefitsCheckListData } from '../../../../components/checkoutBenefits/benefitsCheckList';
import type { Participations } from '../../../../helpers/abTests/models';
import type { LandingPageVariant } from '../../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	filterBenefitByABTest,
	filterBenefitByRegion,
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
): BenefitsCheckListData[] | undefined => {
	// Three Tier products get their config from the Landing Page tool
	if (productKey === 'Contribution') {
		// Also show SupporterPlus benefits greyed out
		return benefitsAsChecklist({
			checked: landingPageSettings.products.Contribution.benefits,
			unchecked: landingPageSettings.products.SupporterPlus.benefits,
		});
	} else if (productKey === 'SupporterPlus') {
		return benefitsAsChecklist({
			checked: landingPageSettings.products.SupporterPlus.benefits,
			unchecked: [],
		});
	} else if (productKey === 'TierThree') {
		// Also show SupporterPlus benefits
		return benefitsAsChecklist({
			checked: [
				...landingPageSettings.products.TierThree.benefits,
				...landingPageSettings.products.SupporterPlus.benefits,
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
