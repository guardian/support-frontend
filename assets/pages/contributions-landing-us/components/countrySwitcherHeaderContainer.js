// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from '../contributionsLandingUSReducer';


// ----- Setup ----- //

const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates', 'EURCountries'];


// ----- Functions ----- //

function handleCountryGroupChange(value: string): void {
  switch (value) {
    case 'GBPCountries':
      window.location.pathname = '/uk/contribute';
      break;
    case 'AUDCountries':
      window.location.pathname = '/au';
      break;
    case 'EURCountries':
      window.location.pathname = '/eu/contribute';
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
