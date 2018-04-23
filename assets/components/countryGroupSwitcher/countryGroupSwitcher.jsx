// @flow

// ----- Imports ----- //

import React from 'react';

import { countryGroups } from 'helpers/internationalisation/countryGroup';
import SelectInput from 'components/selectInput/selectInput';
import { SvgGlobe } from 'components/svgs/globe';
import { currencies } from 'helpers/internationalisation/currency';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { SelectOption } from 'components/selectInput/selectInput';

// ----- Props ----- //


type PropTypes = {
  countryGroupIds: CountryGroupId[],
  selectedCountryGroup: CountryGroupId,
  onCountryGroupSelect: (string) => void,
};


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
      <SelectInput id="qa-country-group-dropdown" className="component-country-group-switcher__selector" onChange={props.onCountryGroupSelect} options={options} />
    </div>
  );
}


// ----- Exports ----- //

export default CountryGroupSwitcher;
