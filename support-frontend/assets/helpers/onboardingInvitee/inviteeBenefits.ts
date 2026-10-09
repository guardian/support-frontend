import type { BenefitsCheckListData } from 'components/checkoutBenefits/benefitsCheckList';

const extraAccountsBenefit = 'Three extra accounts to share';

export function withoutExtraAccountsBenefit(
	benefits: BenefitsCheckListData[],
): BenefitsCheckListData[] {
	return benefits.filter((benefit) => benefit.text !== extraAccountsBenefit);
}
