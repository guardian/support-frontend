// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { setCountryGroup } from 'helpers/page/pageActions';
import type { State } from '../contributionsLandingReducers';


const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates'];

// ----- Functions ----- //

function handleCountryGroupChange(dispatch) {
  return (value: string) => {

    if (value === 'GBPCountries') {
      window.location.href = '/uk';
    }

    switch (value) {
      case 'UnitedStates':
        dispatch(setCountryGroup('UnitedStates'));
        break;
      case 'AUDCountries':
        dispatch(setCountryGroup('AUDCountries'));
        break;
      case 'EURCountries':
        dispatch(setCountryGroup('EURCountries'));
        break;
      default:
    }

  };
}

// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    countryGroupIds: availableCountriesGroups,
    selectedCountryGroup: state.common.countryGroup,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    onCountryGroupSelect: handleCountryGroupChange(dispatch),
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(CountrySwitcherHeader);
