// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgGuardianLogo } from 'components/svg/svg';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

type PropTypes = {
  countryGroupIds: CountryGroupId[],
  selectedCountryGroup: CountryGroupId,
  onCountryGroupSelect: (CountryGroupId) => void,
};


// ----- Component ----- //

const CountrySwitcherHeader = (props: PropTypes) => (
  <header className="component-country-switcher-header">
    <div className="component-country-switcher-header__content gu-header-margin">
      <CountryGroupSwitcher
        countryGroupIds={props.countryGroupIds}
        selectedCountryGroup={props.selectedCountryGroup}
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
