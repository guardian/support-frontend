import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { getGlobal, isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { FeatureSwitches } from 'helpers/globalsAndSwitches/window';

type FeatureFlags = Record<keyof FeatureSwitches, boolean>;

const FeatureSwitchesContext = createContext<FeatureFlags | undefined>(
	undefined,
);

export function FeatureSwitchesProvider({ children }: { children: ReactNode }) {
	const value = useMemo(() => {
		const featureSwitches =
			getGlobal<Record<string, unknown>>('settings.switches.featureSwitches') ??
			{};

		return Object.fromEntries(
			Object.keys(featureSwitches).map((flag) => [
				flag,
				isSwitchOn(`featureSwitches.${flag}`),
			]),
		) as FeatureFlags;
	}, []);

	return (
		<FeatureSwitchesContext.Provider value={value}>
			{children}
		</FeatureSwitchesContext.Provider>
	);
}

export function useFeatureSwitches(): FeatureFlags {
	const context = useContext(FeatureSwitchesContext);

	if (!context) {
		throw new Error(
			'useFeatureSwitches must be used within a FeatureSwitchesProvider',
		);
	}

	return context;
}
