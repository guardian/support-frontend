// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from '../bundlesLandingReducers';


const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates', 'EURCountries', 'AUDCountries'];

// ----- Functions ----- //

function handleCountryGroupChange(value: string): void {
  switch (value) {
    case 'UnitedStates':
      window.location.pathname = '/us';
      break;
    case 'AUDCountries':
      window.location.pathname = '/au';
      break;
    case 'EURCountries':
      window.location.pathname = '/eu';
      break;
    default:
  }
}


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    countryGroupIds: availableCountriesGroups,
    selectedCountryGroup: state.common.countryGroup,
    onCountryGroupSelect: handleCountryGroupChange,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(CountrySwitcherHeader);
