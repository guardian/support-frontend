// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import { countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/page';
import type { PropTypes } from './countrySwitcherHeader';


// ------ Component ----- //

export default function (subPath: string, listOfCountries: CountryGroupId[]) {

  function handleChange(cg: CountryGroupId): void {
    window.location.pathname = `/${countryGroups[cg].supportInternationalisationId}${subPath}`;
  }

  function mapStateToProps(state: { common: CommonState }): PropTypes {

    return {
      countryGroupIds: listOfCountries,
      selectedCountryGroup: state.common.countryGroup,
      onCountryGroupSelect: handleChange,
    };
  }

  return connect(mapStateToProps)(CountrySwitcherHeader);

}
