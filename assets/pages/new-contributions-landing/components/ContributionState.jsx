// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { usStates, caStates } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgGlobe from 'components/svgs/globe';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //
type PropTypes = {
  countryGroupId: CountryGroupId,
  onChange: (Event => void) | false,
};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
});

// ----- Render ----- //

const renderState = ([stateValue, stateName]: [string, string]) => (
  <option value={stateValue}>{stateName}</option>
);

const renderStatesField = (states: { [string]: string }, onChange: (Event => void) | false) => (
  <div className={classNameWithModifiers('form__field', ['contribution-state'])}>
    <label className="form__label" htmlFor="contributionState">State</label>
    <span className="form__input-with-icon">
      <select id="contributionState" className="form__input" placeholder="State" onChange={onChange} required>
        <option />
        {(Object.entries(states): any).map(renderState)}
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
      return renderStatesField(usStates, props.onChange);
    case 'Canada':
      return renderStatesField(caStates, props.onChange);
    default:
      return null;
  }
}


ContributionState.defaultProps = {
  onChange: false,
};

const NewContributionState = connect(mapStateToProps)(ContributionState);

export { NewContributionState };
