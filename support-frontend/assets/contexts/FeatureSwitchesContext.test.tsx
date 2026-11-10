import { storage } from '@guardian/libs';
import { renderHook } from '@testing-library/react';
import '__mocks__/settingsMock';
import {
	FeatureSwitchesProvider,
	useFeatureSwitches,
} from './FeatureSwitchesContext';

describe('FeatureSwitchesProvider', () => {
	beforeEach(() => {
		storage.local.clear();
		window.guardian.settings.switches.featureSwitches = {
			enableMParticle: 'On',
		};
	});

	afterEach(() => {
		storage.local.clear();
	});

	it('keeps conversions off when the server omits the switch', () => {
		const { result } = renderHook(() => useFeatureSwitches(), {
			wrapper: FeatureSwitchesProvider,
		});

		expect(result.current.enableMParticleConversions).toBe(false);
		expect(result.current.enableMParticle).toBe(true);
	});

	it('allows a local conversion override when the server omits the switch', () => {
		storage.local.set('enableMParticleConversions', 'On');
		const { result } = renderHook(() => useFeatureSwitches(), {
			wrapper: FeatureSwitchesProvider,
		});

		expect(result.current.enableMParticleConversions).toBe(true);
		expect(result.current.enableMParticle).toBe(true);
	});

	it('lets a local off override disable the enabled server switch', () => {
		window.guardian.settings.switches.featureSwitches.enableMParticleConversions =
			'On';
		storage.local.set('enableMParticleConversions', 'Off');
		const { result } = renderHook(() => useFeatureSwitches(), {
			wrapper: FeatureSwitchesProvider,
		});

		expect(result.current.enableMParticleConversions).toBe(false);
	});
});
