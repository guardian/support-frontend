import { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isStudentBeansRegionValid } from './isStudentBeansRegionValid';

describe('isStudentBeansRegionValid', () => {
	it.each`
		region                  | country            | eurInclude | expected
		${SupportRegionId.EU}   | ${CountryCode.DE}  | ${true}    | ${true}
		${SupportRegionId.EU}   | ${CountryCode.FR}  | ${true}    | ${true}
		${SupportRegionId.EU}   | ${CountryCode.ES}  | ${true}    | ${true}
		${SupportRegionId.EU}   | ${CountryCode.IE}  | ${true}    | ${true}
		${SupportRegionId.EU}   | ${CountryCode.NL}  | ${true}    | ${true}
		${SupportRegionId.EU}   | ${CountryCode.IT}  | ${true}    | ${false}
		${SupportRegionId.UK}   | ${undefined}       | ${true}    | ${true}
		${SupportRegionId.US}   | ${undefined}       | ${true}    | ${true}
		${SupportRegionId.CA}   | ${undefined}       | ${true}    | ${true}
		${SupportRegionId.AU}   | ${undefined}       | ${true}    | ${false}
		${SupportRegionId.NZ}   | ${undefined}       | ${true}    | ${false}
		${SupportRegionId.EU}   | ${CountryCode.DE}  | ${false}   | ${false}
		${SupportRegionId.EU}   | ${CountryCode.FR}  | ${false}   | ${false}
		${SupportRegionId.EU}   | ${CountryCode.ES}  | ${false}   | ${false}
		${SupportRegionId.EU}   | ${CountryCode.IE}  | ${false}   | ${false}
		${SupportRegionId.EU}   | ${CountryCode.NL}  | ${false}   | ${false}
	`(
		`should return $expected for eur included $eurInclude region $region $country`,
		({ region, country, eurInclude, expected }) => {
			const isStudentRegionValidResult = isStudentBeansRegionValid(
				region,
				eurInclude,
				country,
			);
			expect(isStudentRegionValidResult).toEqual(expected);
		},
	);
});
