// @flow

import type { Participations } from 'helpers/abTests/abtest';
import type { Settings } from 'helpers/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ContributionAmounts } from 'helpers/contributions';

export function getAmounts(
  settings: Settings,
  abParticipations: Participations,
  countryGroupId: CountryGroupId,
): ContributionAmounts {
  if (!settings.amounts) {
    return {};
  }

  const { test, control } = settings.amounts[countryGroupId];
  if (!test) {
    return control;
  }

  const variantName = abParticipations[test.name];
  const variant = test.variants.find(v => v.name === variantName);
  if (!variant) {
    return control;
  }
  return variant.amounts;
}
