// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import { countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/commonReducer';
import type { PropTypes } from './countrySwitcherHeader';


// ------ Component ----- //

export default function (subPath: string, listOfCountries: CountryGroupId[]) {

  function handleChange(cgId: CountryGroupId): void {
    window.location.pathname = `/${countryGroups[cgId].supportInternationalisationId}${subPath}`;
  }

  function mapStateToProps(state: { common: CommonState }): PropTypes {

    return {
      countryGroupIds: listOfCountries,
      selectedCountryGroupId: state.common.internationalisation.countryGroupId,
      onCountryGroupSelect: handleChange,
    };
  }

  return connect(mapStateToProps)(CountrySwitcherHeader);

}
