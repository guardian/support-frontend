import type {
	LandingPageTest,
	LandingPageVariant,
} from '../globalsAndSwitches/landingPageSettings';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import { getMvtId, randomNumber } from './abtest';

export type LandingPageSelection = LandingPageVariant & { testName: string };

export const fallBackLandingPageSelection: LandingPageSelection = {
	testName: 'FALLBACK_LANDING_PAGE',
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism',
		subheading:
			"We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. Cancel anytime.",
	},
};

export function getLandingPageSettings(
	countryGroupId: CountryGroupId,
	tests: LandingPageTest[] = [],
	mvtId: number = getMvtId(),
): LandingPageVariant & { testName: string } {
	const test = tests
		.filter((test) => test.status == 'Live')
		.find((test) => {
			const { countryGroups } = test.targeting;
			return countryGroups.includes(countryGroupId);
		});

  if (test) {
    const idx = randomNumber(mvtId, test.name) % test.variants.length;
    const variant = test.variants[idx];

    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra cautious */
    if (variant) {
      return {
        testName: test.name,
        ...variant,
      };
    }
  }
  return fallBackLandingPageSelection;
}
