// @flow

import { tests as allTests } from 'helpers/abTests/abtestDefinitions';
import { type AmountsRegions } from 'helpers/contributions';
import type { Test, Participations } from 'helpers/abTests/abtest';

function overrideAmountsForTest(
  variantId: string,
  abTest: Test,
  currentAmountsRegions: AmountsRegions,
): AmountsRegions {

  const newAmountsRegions = { ...currentAmountsRegions };

  const variant = abTest.variants.find(v => v.id === variantId);

  if (variant && variant.amountsRegions) {
    const { amountsRegions } = variant;

    Object.keys(amountsRegions).forEach((countryGroupId) => {

      Object.keys(amountsRegions[countryGroupId]).forEach((contributionType) => {

        newAmountsRegions[countryGroupId][contributionType] = amountsRegions[countryGroupId][contributionType];
      });
    });
  }

  return newAmountsRegions;
}

// Returns a new AmountsRegions by combining currentAmountsRegions with any test participation amounts
export function overrideAmountsForParticipations(
  abParticipations: Participations,
  currentAmountsRegions: AmountsRegions,
): AmountsRegions {

  return Object.keys(abParticipations).reduce((amountsRegions, testName) => {
    const test = allTests[testName];

    if (test && test.type === 'AMOUNTS') {
      const variant = abParticipations[testName];
      return overrideAmountsForTest(variant, test, amountsRegions);
    }

    return amountsRegions;

  }, currentAmountsRegions);
}
