import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';

export const useDMCCLayout = (): boolean => {
	const { enableDMCCLayout } = useFeatureSwitches();
	return enableDMCCLayout && Country.detect() === 'GB';
};

export const useDMCCLayoutDigital = (): boolean => {
	const { enableDMCCLayoutDigital } = useFeatureSwitches();
	return enableDMCCLayoutDigital && Country.detect() === 'GB';
};

export const useDMCCLayoutPrint = (): boolean => {
	const { enableDMCCLayoutPrint } = useFeatureSwitches();
	return enableDMCCLayoutPrint && Country.detect() === 'GB';
};
