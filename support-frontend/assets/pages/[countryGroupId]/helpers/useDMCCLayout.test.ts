import type { CountryCode } from '@modules/internationalisation/country';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';
import { useDMCCLayout } from './useDMCCLayout';

jest.mock('contexts/FeatureSwitchesContext', () => ({
	__esModule: true,
	useFeatureSwitches: jest.fn(),
}));

const useFeatureSwitchesMock = jest.mocked(useFeatureSwitches);

describe('useDMCCLayout', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each`
		country | enableDMCCLayout | expected
		${'GB'} | ${true}          | ${true}
		${'GB'} | ${false}         | ${false}
		${'US'} | ${true}          | ${false}
		${'US'} | ${false}         | ${false}
		${'IE'} | ${true}          | ${false}
		${'AU'} | ${true}          | ${false}
	`(
		'should return $expected for country:$country when enableDMCCLayout:$enableDMCCLayout',
		({ country, enableDMCCLayout, expected }) => {
			useFeatureSwitchesMock.mockReturnValue({
				enableDMCCLayout: enableDMCCLayout as boolean,
			} as ReturnType<typeof useFeatureSwitches>);
			jest.spyOn(Country, 'detect').mockReturnValue(country as CountryCode);

			expect(useDMCCLayout()).toBe(expected);
		},
	);
});
