import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { getPlanBenefitData } from 'pages/paper-subscription-landing/planData';
import type { BenefitsCheckListData } from '../../../../components/checkoutBenefits/benefitsCheckList';
import type { Participations } from '../../../../helpers/abTests/models';
import type { LandingPageVariant } from '../../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	filterBenefitByABTest,
	filterBenefitByRegion,
} from '../../../../helpers/productCatalog';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
	ProductBenefit,
	ProductDescription,
} from '../../../../helpers/productCatalog';

export const getPaperPlusDigitalBenefits = (
	ratePlanKey: ActiveRatePlanKey,
	productKey: ActiveProductKey,
): BenefitsCheckListData[] | undefined => {
	switch (productKey) {
		case 'HomeDelivery':
			return getPlanBenefitData(
				ratePlanKey as PaperProductOptions,
				'HomeDelivery',
			);
		case 'SubscriptionCard':
			return getPlanBenefitData(
				ratePlanKey as PaperProductOptions,
				'Collection',
			);
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
	showNewspaperArchiveBenefit?: boolean,
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
		const checkedBenefits = showNewspaperArchiveBenefit
			? [
					...landingPageSettings.products.TierThree.benefits,
					{
						copy: `Unlimited access to the Guardian's 200-year newspaper archive`,
						tooltip: `Look back on more than 200 years of world history with the Guardian newspaper archive. Get digital access to every front page, article and advertisement, as it was printed${
							countryGroupId !== 'GBPCountries' ? ' in the UK' : ''
						}, since 1821.`,
					},
					...landingPageSettings.products.SupporterPlus.benefits,
			  ]
			: [
					...landingPageSettings.products.TierThree.benefits,
					...landingPageSettings.products.SupporterPlus.benefits,
			  ];

		// Also show SupporterPlus benefits
		return benefitsAsChecklist({
			checked: checkedBenefits,
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
