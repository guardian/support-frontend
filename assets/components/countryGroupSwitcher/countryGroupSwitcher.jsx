// @flow

// ----- Imports ----- //

import React from 'react';
import { compose } from 'redux';

import SelectInput from 'components/selectInput/selectInput';

import {
  countryGroups,
  stringToCountryGroupId,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import type { SelectOption } from 'components/selectInput/selectInput';


// ----- Props ----- //

export type PropTypes = {|
  countryGroupIds: CountryGroupId[],
  selectedCountryGroup: CountryGroupId,
  onCountryGroupSelect: CountryGroupId => void,
|};


// ----- Component ----- //

function CountryGroupSwitcher(props: PropTypes) {

  const options: SelectOption[] =
    props.countryGroupIds.map((countryGroupId: CountryGroupId) =>
      ({
        value: countryGroupId,
        text: `${countryGroups[countryGroupId].name} (${currencies[countryGroups[countryGroupId].currency].extendedGlyph})`,
        selected: countryGroupId === props.selectedCountryGroup,
      }));

  return (
    <div className="component-country-group-switcher">
      <SelectInput
        id="qa-country-group-dropdown"
        onChange={compose(props.onCountryGroupSelect, stringToCountryGroupId)}
        options={options}
        label="Select your region"
      />
    </div>
  );
}


// ----- Exports ----- //

export default CountryGroupSwitcher;
