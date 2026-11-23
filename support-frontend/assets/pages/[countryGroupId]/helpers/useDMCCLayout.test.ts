import type { CountryCode } from '@modules/internationalisation/country';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { Country } from 'helpers/internationalisation/classes/country';
import type { ActiveProductKey } from 'helpers/productCatalog';
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
		country | productKey                     | enableDMCCLayoutDigital | expected
		${'GB'} | ${'GuardianAdLite'}            | ${true}                 | ${true}
		${'GB'} | ${'Contribution'}              | ${true}                 | ${true}
		${'GB'} | ${'SupporterPlus'}             | ${true}                 | ${true}
		${'GB'} | ${'DigitalSubscription'}       | ${true}                 | ${true}
		${'GB'} | ${'GuardianWeeklyDomestic'}    | ${true}                 | ${false}
		${'US'} | ${'GuardianWeeklyRestOfWorld'} | ${true}                 | ${false}
		${'GB'} | ${'HomeDelivery'}              | ${true}                 | ${false}
		${'GB'} | ${'SubscriptionCard'}          | ${true}                 | ${false}
		${'GB'} | ${'Digital'}                   | ${false}                | ${false}
		${'US'} | ${'Digital'}                   | ${true}                 | ${false}
		${'US'} | ${'Digital'}                   | ${false}                | ${false}
		${'IE'} | ${'Digital'}                   | ${true}                 | ${false}
		${'AU'} | ${'Digital'}                   | ${true}                 | ${false}
	`(
		'should return $expected for country:$country when enableDMCCLayoutDigital',
		({ country, productKey, enableDMCCLayoutDigital, expected }) => {
			useFeatureSwitchesMock.mockReturnValue({
				enableDMCCLayoutDigital: enableDMCCLayoutDigital as boolean,
			} as ReturnType<typeof useFeatureSwitches>);
			jest.spyOn(Country, 'detect').mockReturnValue(country as CountryCode);
			expect(useDMCCLayoutDigital(productKey as ActiveProductKey)).toBe(
				expected,
			);
		},
	);

	it.each`
		country | productKey                     | enableDMCCLayoutPrint | expected
		${'GB'} | ${'GuardianAdLite'}            | ${true}               | ${false}
		${'GB'} | ${'Contribution'}              | ${true}               | ${false}
		${'GB'} | ${'SupporterPlus'}             | ${true}               | ${false}
		${'GB'} | ${'DigitalSubscription'}       | ${true}               | ${false}
		${'GB'} | ${'GuardianWeeklyDomestic'}    | ${true}               | ${true}
		${'US'} | ${'GuardianWeeklyRestOfWorld'} | ${true}               | ${false}
		${'GB'} | ${'HomeDelivery'}              | ${true}               | ${true}
		${'GB'} | ${'SubscriptionCard'}          | ${true}               | ${true}
		${'GB'} | ${'Digital'}                   | ${false}              | ${false}
		${'US'} | ${'Digital'}                   | ${true}               | ${false}
		${'US'} | ${'Digital'}                   | ${false}              | ${false}
		${'IE'} | ${'Digital'}                   | ${true}               | ${false}
		${'AU'} | ${'Digital'}                   | ${true}               | ${false}
	`(
		'should return $expected for country:$country when enableDMCCLayoutPrint',
		({ country, productKey, enableDMCCLayoutPrint, expected }) => {
			useFeatureSwitchesMock.mockReturnValue({
				enableDMCCLayoutPrint: enableDMCCLayoutPrint as boolean,
			} as ReturnType<typeof useFeatureSwitches>);
			jest.spyOn(Country, 'detect').mockReturnValue(country as CountryCode);
			expect(useDMCCLayoutPrint(productKey as ActiveProductKey)).toBe(expected);
		},
	);
});
