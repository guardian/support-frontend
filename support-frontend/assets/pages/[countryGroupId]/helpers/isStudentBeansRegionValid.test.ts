import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isStudentBeansRegionValid } from './isStudentBeansRegionValid';

describe('isStudentBeansRegionValid', () => {
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
		${SupportRegionId.AU} | ${undefined} | ${true}    | ${false}
		${SupportRegionId.NZ} | ${undefined} | ${true}    | ${false}
		${SupportRegionId.EU} | ${'DE'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'FR'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'ES'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'IE'}      | ${false}   | ${false}
		${SupportRegionId.EU} | ${'NL'}      | ${false}   | ${false}
	`(
		`should return $expected for eur included $eurInclude region $region $country`,
		({ region, country, eurInclude, expected }) => {
			const isStudentRegionValidResult = isStudentBeansRegionValid(
				region as SupportRegionId,
				country as CountryCode,
				eurInclude as boolean,
			);
			expect(isStudentRegionValidResult).toEqual(expected);
		},
	);
});
