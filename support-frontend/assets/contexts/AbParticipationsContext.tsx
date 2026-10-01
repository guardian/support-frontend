import { createContext, type ReactNode, useContext } from 'react';
import type { Participations } from 'helpers/abTests/models';

const AbParticipationsContext = createContext<Participations | undefined>(
	undefined,
);

export function AbParticipationsProvider({
	participations,
	children,
}: {
	participations: Participations;
	children: ReactNode;
}) {
	return (
		<AbParticipationsContext.Provider value={participations}>
			{children}
		</AbParticipationsContext.Provider>
	);
}

export function useAbParticipations(): Participations {
	const context = useContext(AbParticipationsContext);

	if (!context) {
		throw new Error(
			'useAbParticipations must be used within an AbParticipationsProvider',
		);
	}

	return context;
}
