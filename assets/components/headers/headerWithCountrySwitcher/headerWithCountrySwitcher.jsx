// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgGuardianLogo } from 'components/svg/svg';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

type PropTypes = {
  countryGroupIds?: ?Array<CountryGroupId>,
  selectedCountryGroup?: ?CountryGroupId,
  onCountryGroupSelect?: ?(String) => void,
};


// ----- Component ----- //

const HeaderWithCountrySwitcher = (props: PropTypes) => (
  <header className="component-simple-header">
    <CountryGroupSwitcher
      countryGroupIds={props.countryGroupIds}
      selectedCountryGroup={props.selectedCountryGroup}
      onCountryGroupSelect={props.onCountryGroupSelect}
    />
    <div className="component-simple-header__content gu-header-margin">
      <a className="component-simple-header__link" href="https://www.theguardian.com">
        <div className="accessibility-hint">The guardian logo</div>
        <SvgGuardianLogo />
      </a>
    </div>
  </header>
);

export default HeaderWithCountrySwitcher;
