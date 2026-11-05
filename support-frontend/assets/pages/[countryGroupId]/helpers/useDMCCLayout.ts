import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';

export const useDMCCLayout = (): boolean => {
	const { enableDMCCLayout } = useFeatureSwitches();
	return enableDMCCLayout && Country.detect() === 'GB';
};
