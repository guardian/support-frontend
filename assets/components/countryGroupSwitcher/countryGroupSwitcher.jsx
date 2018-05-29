// @flow

// ----- Imports ----- //

import React from 'react';

import SelectInput from 'components/selectInput/selectInput';
import SvgGlobe from 'components/svgs/globe';

import {
  countryGroups,
  fromString,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import type { SelectOption } from 'components/selectInput/selectInput';


// ----- Props ----- //

type PropTypes = {
  countryGroupIds: CountryGroupId[],
  selectedCountryGroup: CountryGroupId,
  onCountryGroupSelect: CountryGroupId => void,
};


// ----- Functions ----- //

function stringToCountryGroup(cg: string): CountryGroupId {
  return fromString(cg) || 'GBPCountries';
}


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
      <SvgGlobe />
      <SelectInput
        id="qa-country-group-dropdown"
        className="component-country-group-switcher__selector"
        onChange={cg => props.onCountryGroupSelect(stringToCountryGroup(cg))}
        options={options}
        label="Select your region"
      />
    </div>
  );
}


// ----- Exports ----- //

export default CountryGroupSwitcher;
