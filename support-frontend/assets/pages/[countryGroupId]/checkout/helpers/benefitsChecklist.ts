import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { multipleAccountBenefitCopy } from 'helpers/abTests/multipleAccounts';
import type { BenefitsCheckListData } from '../../../../components/checkoutBenefits/benefitsCheckList';
import type { LandingPageVariant } from '../../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	filterBenefitByRegion,
	productCatalogDescription,
} from '../../../../helpers/productCatalog';
import type { ProductBenefit } from '../../../../helpers/productCatalog';

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

const removeBenefitByCopy = (
	benefits: ProductBenefit[],
	benefitToRemove: string,
): ProductBenefit[] => {
	return benefits.filter((benefit) => benefit.copy !== benefitToRemove);
};

export const filterBenefits = (
	benefits: ProductBenefit[],
	countryGroupId: CountryGroupId,
): ProductBenefit[] => {
	return benefits.filter((benefit) =>
		filterBenefitByRegion(benefit, countryGroupId),
	);
};

export const getBenefitsChecklist = (
	benefits: ProductBenefit[],
	countryGroupId: CountryGroupId,
): BenefitsCheckListData[] => {
	return filterBenefits(benefits, countryGroupId).map((benefit) => ({
		isChecked: true,
		text: `${benefit.copyBoldStart ?? ''}${benefit.copy}`,
	}));
};

export const getProductBenefitsChecklist = (
	productKey: ProductKey,
	landingPageSettings: LandingPageVariant,
	countryGroupId: CountryGroupId,
): BenefitsCheckListData[] | undefined => {
	// Tier products get their config from the Landing Page tool
	if (productKey === 'Contribution') {
		// Also show SupporterPlus benefits greyed out
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.Contribution?.benefits ??
				filterBenefits(
					productCatalogDescription.Contribution.benefits,
					countryGroupId,
				),
			unchecked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterBenefits(
					productCatalogDescription.SupporterPlus.benefits,
					countryGroupId,
				),
		});
	} else if (productKey === 'SupporterPlus') {
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterBenefits(
					productCatalogDescription.SupporterPlus.benefits,
					countryGroupId,
				),
			unchecked: [],
		});
	} else if (productKey === 'DigitalSubscription') {
		return getDigitalSubscriptionBenefitsChecklist(
			landingPageSettings,
			countryGroupId,
			'primaryUser',
		);
	}
	return;
};

export const getDigitalSubscriptionBenefitsChecklist = (
	landingPageSettings: LandingPageVariant,
	countryGroupId: CountryGroupId,
	user: 'primaryUser' | 'secondaryUser',
) => {
	const digitalPlusDefaultBenefits = filterBenefits(
		productCatalogDescription.DigitalSubscription.benefits,
		countryGroupId,
	);
	const digitalPlusBenefits =
		landingPageSettings.products.DigitalSubscription?.benefits ??
		digitalPlusDefaultBenefits;
	const finalDigitalPlusBenefits =
		user === 'secondaryUser'
			? removeBenefitByCopy(digitalPlusBenefits, multipleAccountBenefitCopy)
			: digitalPlusBenefits;

	return benefitsAsChecklist({
		checked: [
			...finalDigitalPlusBenefits,
			...(landingPageSettings.products.SupporterPlus?.benefits ??
				filterBenefits(
					productCatalogDescription.SupporterPlus.benefits,
					countryGroupId,
				)),
		],
		unchecked: [],
	});
};
