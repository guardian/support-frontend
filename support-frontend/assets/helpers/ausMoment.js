// @flow

import { getQueryParameter } from 'helpers/url';
import type { IsoCountry } from 'helpers/internationalisation/country';

const ausMomentEnabled = (countryId: IsoCountry) => {
  const manualToggle = Boolean(getQueryParameter('ausMomentEnabled', ''));
  const momentSwitchedOn = (window && window.guardian && window.guardian.ausMomentEnabled);
  const inAustralia = countryId === 'AU';

  return ((momentSwitchedOn || manualToggle) && inAustralia);
};

export default ausMomentEnabled;
