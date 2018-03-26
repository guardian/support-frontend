// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from '../contributionsLandingReducer';


// ----- Setup ----- //

const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates', 'EURCountries', 'International', 'NZDCountries'];


// ----- Functions ----- //

function handleCountryGroupChange(value: CountryGroupId): void {
  switch (value) {
    case 'GBPCountries':
      window.location.pathname = '/uk/contribute';
      break;
    case 'AUDCountries':
      window.location.pathname = '/au/contribute';
      break;
    case 'EURCountries':
      window.location.pathname = '/eu/contribute';
      break;
    case 'UnitedStates':
      window.location.pathname = '/us/contribute';
      break;
    case 'International':
      window.location.pathname = '/int/contribute';
      break;
    case 'NZDCountries':
      window.location.pathname = '/nz/contribute';
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
