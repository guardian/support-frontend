import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';
import type { ActiveProductKey } from 'helpers/productCatalog';
import {
	isDMCCPrintProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

export const useDMCCLayoutDigital = (productKey: ActiveProductKey): boolean => {
	const { enableDMCCLayoutDigital } = useFeatureSwitches();
	return (
		enableDMCCLayoutDigital &&
		!isPrintProduct(productKey) &&
		Country.detect() === 'GB'
	);
};

export const useDMCCLayoutPrint = (productKey: ActiveProductKey): boolean => {
	const { enableDMCCLayoutPrint } = useFeatureSwitches();
	return (
		enableDMCCLayoutPrint &&
		isDMCCPrintProduct(productKey) &&
		Country.detect() === 'GB'
	);
};
