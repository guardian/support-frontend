import type { CountryCode } from '@guardian/libs';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isStudentBeansRegionValid } from './isStudentBeansRegionValid';

describe('isStudentRegionValid', () => {
	it.each`
		region  | country | expected
		${'eu'} | ${'DE'} | ${true}
		${'eu'} | ${'FR'} | ${true}
		${'eu'} | ${'ES'} | ${true}
		${'eu'} | ${'IE'} | ${true}
		${'eu'} | ${'NL'} | ${true}
		${'eu'} | ${'IT'} | ${false}
		${'uk'} | ${''}   | ${true}
		${'us'} | ${''}   | ${true}
		${'ca'} | ${''}   | ${true}
		${'au'} | ${''}   | ${false}
		${'nz'} | ${''}   | ${false}
	`(
		`should return $expected for region $region $country`,
		({ region, country, expected }) => {
			const countryOrUndefined =
				country === '' ? undefined : (country as CountryCode);
			const isStudentRegionValidResult = isStudentBeansRegionValid(
				region as SupportRegionId,
				countryOrUndefined,
			);
			expect(isStudentRegionValidResult).toEqual(expected);
		},
	);
});
