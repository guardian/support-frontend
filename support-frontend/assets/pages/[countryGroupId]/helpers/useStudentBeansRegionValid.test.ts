import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { useStudentBeansRegionValid } from './useStudentBeansRegionValid';

jest.mock('contexts/FeatureSwitchesContext', () => ({
	__esModule: true,
	useFeatureSwitches: jest.fn(),
}));

const useFeatureSwitchesMock = jest.mocked(useFeatureSwitches);

describe('useStudentBeansRegionValid', () => {
	it.each`
		region                | country      | eurInclude | expected
		${SupportRegionId.EU} | ${'DE'}      | ${true}    | ${true}
		${SupportRegionId.EU} | ${'FR'}      | ${true}    | ${true}
		${SupportRegionId.EU} | ${'ES'}      | ${true}    | ${true}
		${SupportRegionId.EU} | ${'IE'}      | ${true}    | ${true}
		${SupportRegionId.EU} | ${'NL'}      | ${true}    | ${true}
		${SupportRegionId.EU} | ${'IT'}      | ${true}    | ${false}
		${SupportRegionId.UK} | ${undefined} | ${true}    | ${true}
		${SupportRegionId.US} | ${undefined} | ${true}    | ${true}
		${SupportRegionId.CA} | ${undefined} | ${true}    | ${true}
		${SupportRegionId.UK} | ${undefined} | ${false}   | ${true}
		${SupportRegionId.US} | ${undefined} | ${false}   | ${true}
		${SupportRegionId.CA} | ${undefined} | ${false}   | ${true}
		${SupportRegionId.AU} | ${undefined} | ${true}    | ${false}
		${SupportRegionId.NZ} | ${undefined} | ${true}    | ${false}
		${SupportRegionId.AU} | ${undefined} | ${false}   | ${false}
		${SupportRegionId.NZ} | ${undefined} | ${false}   | ${false}
		${SupportRegionId.EU} | ${'DE'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'FR'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'ES'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'IE'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'NL'}      | ${false}   | ${false}
	`(
		`should return $expected, for region/country:$region/$country, when enableStudentBeansEurope:$eurInclude`,
		({ region, country, eurInclude, expected }) => {
			useFeatureSwitchesMock.mockReturnValue({
				enableStudentBeansEurope: eurInclude as boolean,
			} as ReturnType<typeof useFeatureSwitches>);
			const isStudentRegionValidResult = useStudentBeansRegionValid(
				region as SupportRegionId,
				country as CountryCode,
			);
			expect(isStudentRegionValidResult).toEqual(expected);
		},
	);
});
