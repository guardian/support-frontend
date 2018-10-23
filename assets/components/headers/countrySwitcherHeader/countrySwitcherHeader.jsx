// @flow

// ----- Imports ----- //

import React from 'react';

import SvgGuardianLogo from 'components/svgs/guardianLogo';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export type PropTypes = {|
  countryGroupIds: CountryGroupId[],
  selectedCountryGroupId: CountryGroupId,
  onCountryGroupSelect: CountryGroupId => void,
|};


// ----- Component ----- //

const CountrySwitcherHeader = (props: PropTypes) => (
  <header className="component-country-switcher-header">
    <div className="component-country-switcher-header__content">
      <CountryGroupSwitcher
        countryGroupIds={props.countryGroupIds}
        selectedCountryGroup={props.selectedCountryGroupId}
        onCountryGroupSelect={props.onCountryGroupSelect}
      />
      <a className="component-country-switcher-header__link" href="https://www.theguardian.com">
        <div className="accessibility-hint">The guardian logo</div>
        <SvgGuardianLogo />
      </a>
    </div>
  </header>
);

export default CountrySwitcherHeader;
