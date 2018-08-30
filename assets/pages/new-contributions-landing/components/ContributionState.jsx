// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { usStates, caStates } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import SvgGlobe from 'components/svgs/globe';

// ----- Types ----- //
type PropTypes = {
  countryGroupId: CountryGroupId,
  selectedState: string,
};

// ----- Render ----- //

const renderState = (selectedState: string) => ([stateValue, stateName]: [string, string]) => (
  <option value="{stateValue}" selected={stateValue === selectedState}>{stateName}</option>
);

const renderStatesField = (selectedState, states) => (
  <div className="form__field form__field--contribution-state">
    <label className="form__label" htmlFor="contributionState">State</label>
    <span className="form__input-with-icon">
      <select id="contributionState" className="form__input" placeholder="State" required>
        <option />
        {(Object.entries(states): any).map(renderState(selectedState))}
      </select>
      <span className="form__icon">
        <SvgGlobe />
      </span>
    </span>
  </div>
);

function ContributionState(props: PropTypes) {
  switch (props.countryGroupId) {
    case 'UnitedStates':
      return renderStatesField(props.selectedState, usStates);
    case 'Canada':
      return renderStatesField(props.selectedState, caStates);
    default:
      return '';
  }
}

const mapStateToProps = () => ({
  selectedState: 'WY',
});

const NewContributionState = connect(mapStateToProps)(ContributionState);

export { NewContributionState };
