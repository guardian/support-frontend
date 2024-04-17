import type { SelectedAmountsVariant } from 'helpers/contributions';

export const vatCompliantAmountsTestName = 'VAT_COMPLIANCE';

export const isSubjectToVatCompliantAmounts = (
	amountsVariant: SelectedAmountsVariant,
): boolean => {
	const { testName } = amountsVariant;
	return testName === vatCompliantAmountsTestName;
};
