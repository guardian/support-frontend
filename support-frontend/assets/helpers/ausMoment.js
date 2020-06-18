// @flow

import { getQueryParameter } from 'helpers/url';

const ausMomentEnabled = (countryId: string = '') => {
  const manualToggle = Boolean(getQueryParameter('ausMomentEnabled', ''));
  const momentSwitchedOn = (window && window.guardian && window.guardian.ausMomentEnabled);
  const inAustralia = countryId === 'AU';

  return ((momentSwitchedOn || manualToggle) && inAustralia);
};

export default ausMomentEnabled;
