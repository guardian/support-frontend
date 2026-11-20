import type { CountryCode } from '@modules/internationalisation/country';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';
import { useDMCCLayoutDigital, useDMCCLayoutPrint } from './useDMCCLayout';

jest.mock('contexts/FeatureSwitchesContext', () => ({
	__esModule: true,
	useFeatureSwitches: jest.fn(),
}));

const useFeatureSwitchesMock = jest.mocked(useFeatureSwitches);

describe('useDMCCLayout (Print & Digital)', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each`
		country | enableDMCCLayoutDigital | expected
		${'GB'} | ${true}                 | ${true}
		${'GB'} | ${false}                | ${false}
		${'US'} | ${true}                 | ${false}
		${'US'} | ${false}                | ${false}
		${'IE'} | ${true}                 | ${false}
		${'AU'} | ${true}                 | ${false}
	`(
		'should return $expected for country:$country when enableDMCCLayoutDigital',
		({ country, enableDMCCLayoutDigital, expected }) => {
			useFeatureSwitchesMock.mockReturnValue({
				enableDMCCLayoutDigital: enableDMCCLayoutDigital as boolean,
			} as ReturnType<typeof useFeatureSwitches>);
			jest.spyOn(Country, 'detect').mockReturnValue(country as CountryCode);
			expect(useDMCCLayoutDigital()).toBe(expected);
		},
	);

	it.each`
		country | enableDMCCLayoutPrint | expected
		${'GB'} | ${true}               | ${true}
		${'GB'} | ${false}              | ${false}
		${'US'} | ${true}               | ${false}
		${'US'} | ${false}              | ${false}
		${'IE'} | ${true}               | ${false}
		${'AU'} | ${true}               | ${false}
	`(
		'should return $expected for country:$country when enableDMCCLayoutPrint',
		({ country, enableDMCCLayoutPrint, expected }) => {
			useFeatureSwitchesMock.mockReturnValue({
				enableDMCCLayoutPrint: enableDMCCLayoutPrint as boolean,
			} as ReturnType<typeof useFeatureSwitches>);
			jest.spyOn(Country, 'detect').mockReturnValue(country as CountryCode);
			expect(useDMCCLayoutPrint()).toBe(expected);
		},
	);
});
