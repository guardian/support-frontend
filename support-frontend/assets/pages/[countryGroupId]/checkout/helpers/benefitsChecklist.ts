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

export const hideBenefits = (
	benefits: ProductBenefit[],
	abTestNameFind: string,
	abTestVariantShow?: string[],
): ProductBenefit[] => {
	return benefits.map((benefit) => {
		if (benefit.specificToAbTest) {
			return {
				...benefit,
				specificToAbTest: benefit.specificToAbTest.map((abTest) => {
					if (abTest.name === abTestNameFind) {
						return {
							...abTest,
							variants: abTestVariantShow ?? [''],
						};
					}
					return abTest;
				}),
			};
		}
		return benefit;
	});
};

export const filterBenefits = (
	benefits: ProductBenefit[],
	countryGroupId: CountryGroupId,
	abParticipations?: Participations,
): ProductBenefit[] => {
	const benefitsByCountry = benefits.filter((benefit) =>
		filterBenefitByRegion(benefit, countryGroupId),
	);
	if (!abParticipations) {
		return benefitsByCountry;
	}
	return benefitsByCountry.filter((benefit) =>
		filterBenefitByABTest(benefit, abParticipations),
	);
};

export const getBenefitsChecklist = (
	benefits: ProductBenefit[],
	countryGroupId: CountryGroupId,
	abParticipations: Participations,
): BenefitsCheckListData[] => {
	return filterBenefits(benefits, countryGroupId, abParticipations).map(
		(benefit) => ({
			isChecked: true,
			text: `${benefit.copyBoldStart ?? ''}${benefit.copy}`,
		}),
	);
};

export const getProductBenefitsChecklist = (
	productKey: ProductKey,
	landingPageSettings: LandingPageVariant,
	countryGroupId: CountryGroupId,
	abParticipations: Participations,
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
					abParticipations,
				),
			unchecked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterBenefits(
					productCatalogDescription.SupporterPlus.benefits,
					countryGroupId,
					abParticipations,
				),
		});
	} else if (productKey === 'SupporterPlus') {
		return benefitsAsChecklist({
			checked:
				landingPageSettings.products.SupporterPlus?.benefits ??
				filterBenefits(
					productCatalogDescription.SupporterPlus.benefits,
					countryGroupId,
					abParticipations,
				),
			unchecked: [],
		});
	} else if (productKey === 'DigitalSubscription') {
		return getDigitalSubscriptionBenefitsChecklist(
			landingPageSettings,
			countryGroupId,
			abParticipations,
			'benefits',
		);
	}
	return;
};

export const getDigitalSubscriptionBenefitsChecklist = (
	landingPageSettings: LandingPageVariant,
	countryGroupId: CountryGroupId,
	abParticipations: Participations,
	benefitsUser: 'benefits' | 'benefitsSecondaryUser',
) => {
	const landingPageDigitalSubscription =
		landingPageSettings.products.DigitalSubscription;
	const landingPageDigitalSubscriptionBenefits = landingPageDigitalSubscription
		? landingPageDigitalSubscription[benefitsUser]
		: undefined;
	const digitalPlusBenefits =
		landingPageDigitalSubscriptionBenefits ??
		productCatalogDescription.DigitalSubscription[benefitsUser] ??
		[];

	return benefitsAsChecklist({
		checked: [
			...filterBenefits(digitalPlusBenefits, countryGroupId, abParticipations),
			...(landingPageSettings.products.SupporterPlus?.benefits ??
				filterBenefits(
					productCatalogDescription.SupporterPlus.benefits,
					countryGroupId,
					abParticipations,
				)),
		],
		unchecked: [],
	});
};
