// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/page';


const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates', 'EURCountries', 'NZDCountries', 'Canada', 'International', 'AUDCountries'];

// ----- Functions ----- //

function handleCountryGroupChange(value: string): void {
  switch (value) {
    case 'UnitedStates':
      window.location.pathname = '/us/contribute';
      break;
    case 'GBPCountries':
      window.location.pathname = '/uk/contribute';
      break;
    case 'EURCountries':
      window.location.pathname = '/eu/contribute';
      break;
    case 'NZDCountries':
      window.location.pathname = '/nz/contribute';
      break;
    case 'Canada':
      window.location.pathname = '/ca/contribute';
      break;
    case 'International':
      window.location.pathname = '/int/contribute';
      break;
    case 'AUDCountries':
      window.location.pathname = '/au/contribute';
      break;
    default:
  }
}


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupIds: availableCountriesGroups,
    selectedCountryGroup: state.common.countryGroup,
    onCountryGroupSelect: handleCountryGroupChange,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(CountrySwitcherHeader);
