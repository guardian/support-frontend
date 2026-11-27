import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';
import type { ActiveProductKey } from 'helpers/productCatalog';
import {
	isDMCCPrintProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

type DmccLayouts = {
	isDigitalDmcc: boolean;
	isPrintDmcc: boolean;
};
export const useDmccLayout = (productKey: ActiveProductKey): DmccLayouts => {
	const { enableDMCCLayoutDigital, enableDMCCLayoutPrint } =
		useFeatureSwitches();
	const isPrintDmcc =
		Boolean(enableDMCCLayoutPrint) &&
		isDMCCPrintProduct(productKey) &&
		Country.detect() === 'GB';
	const isDigitalDmcc =
		Boolean(enableDMCCLayoutDigital) &&
		!isPrintProduct(productKey) &&
		Country.detect() === 'GB';

	return {
		isDigitalDmcc,
		isPrintDmcc,
	};
};
