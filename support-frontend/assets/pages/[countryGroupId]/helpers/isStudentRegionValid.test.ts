import type { CountryCode } from '@guardian/libs';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isStudentRegionValid } from './isStudentRegionValid';

describe('isStudentRegionValidSub', () => {
	it.each`
		region  | country | expected
		${'eu'} | ${'DE'} | ${true}
		${'eu'} | ${'IT'} | ${false}
		${'uk'} | ${''}   | ${true}
		${'nz'} | ${''}   | ${false}
	`(
		`should return $expected for region $region and country $country`,
		({ region, country, expected }) => {
			const countryOrUndefined =
				country === '' ? undefined : (country as CountryCode);
			const isStudentRegionValidResult = isStudentRegionValid(
				region as SupportRegionId,
				countryOrUndefined,
			);
			expect(isStudentRegionValidResult).toEqual(expected);
		},
	);
});
