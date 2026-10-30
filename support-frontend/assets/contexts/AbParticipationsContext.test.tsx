import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
	AbParticipationsProvider,
	useAbParticipations,
} from './AbParticipationsContext';

describe('useAbParticipations', () => {
	it('returns the participations provided by AbParticipationsProvider', () => {
		const participations = { someTest: 'variant' };
		const wrapper = ({ children }: { children: ReactNode }) => (
			<AbParticipationsProvider participations={participations}>
				{children}
			</AbParticipationsProvider>
		);

		const { result } = renderHook(() => useAbParticipations(), { wrapper });

		expect(result.current).toEqual(participations);
	});

	it('throws when used outside of an AbParticipationsProvider', () => {
		expect(() => renderHook(() => useAbParticipations())).toThrow(
			'useAbParticipations must be used within an AbParticipationsProvider',
		);
	});
});
