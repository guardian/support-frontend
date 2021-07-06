import React from "react";
import { storiesOf } from "@storybook/react";
import { radios, withKnobs } from "@storybook/addon-knobs";
import CountryGroupSwitcher from "components/countryGroupSwitcher/countryGroupSwitcher";
import { GBPCountries, UnitedStates, AUDCountries, EURCountries, NZDCountries, Canada, International } from "helpers/internationalisation/countryGroup";
const stories = storiesOf('Internationalisation', module).addDecorator(withKnobs);
stories.add('Country Group Switcher', () => {
  const countryGroup = radios('Displayed country', {
    GB: GBPCountries,
    US: UnitedStates,
    AUS: AUDCountries,
    EU: EURCountries,
    NZ: NZDCountries,
    CA: Canada,
    INT: International
  }, GBPCountries);
  return <div style={{
    width: '100%',
    padding: '16px',
    backgroundColor: '#04204B',
    color: '#ffffff'
  }}>
      <CountryGroupSwitcher countryGroupIds={[GBPCountries, UnitedStates, AUDCountries, EURCountries, NZDCountries, Canada, International]} selectedCountryGroup={countryGroup} subPath={window.location.search} />
    </div>;
});