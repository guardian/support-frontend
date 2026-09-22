import type { CountryCode } from '@guardian/libs';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isStudentBeansRegionValid } from './isStudentBeansRegionValid';

describe('isStudentRegionValid', () => {
	it.each`
		region  | country | eurInclude | expected
		${'eu'} | ${'DE'} | ${true}    | ${true}
		${'eu'} | ${'FR'} | ${true}    | ${true}
		${'eu'} | ${'ES'} | ${true}    | ${true}
		${'eu'} | ${'IE'} | ${true}    | ${true}
		${'eu'} | ${'NL'} | ${true}    | ${true}
		${'eu'} | ${'IT'} | ${true}    | ${false}
		${'uk'} | ${''}   | ${true}    | ${true}
		${'us'} | ${''}   | ${true}    | ${true}
		${'ca'} | ${''}   | ${true}    | ${true}
		${'au'} | ${''}   | ${true}    | ${false}
		${'nz'} | ${''}   | ${true}    | ${false}
		${'eu'} | ${'DE'} | ${false}   | ${false}
		${'eu'} | ${'FR'} | ${false}   | ${false}
		${'eu'} | ${'ES'} | ${false}   | ${false}
		${'eu'} | ${'IE'} | ${false}   | ${false}
		${'eu'} | ${'NL'} | ${false}   | ${false}
	`(
		`should return $expected for eur included $eurInclude region $region $country`,
		({ region, country, eurInclude, expected }) => {
			const countryOrUndefined =
				country === '' ? undefined : (country as CountryCode);
			const isStudentRegionValidResult = isStudentBeansRegionValid(
				region as SupportRegionId,
				eurInclude as boolean,
				countryOrUndefined,
			);
			expect(isStudentRegionValidResult).toEqual(expected);
		},
	);
});
