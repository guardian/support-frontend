// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { usStates, caStates, type UsState, type CaState } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Types ----- //
type PropTypes = {
  countryGroupId: CountryGroupId,
  selectedState: UsState | CaState,
};

// ----- Render ----- //

const renderState = selectedState => state => (
  <option value="{state[0]}" selected={state[0] === selectedState}>{state[1]}</option>
);

const renderStatesField = (selectedState, states) => (
  <div className="form__field form__field--contribution-state">
    <label className="form__label" htmlFor="contributionState">State</label>
    <span className="form__input-with-icon">
      <select id="contributionState" className="form__input" placeholder="State" required>
        <option />
        {Object.entries(states).map(renderState(selectedState))}
      </select>
      <span className="form__icon">
        <svg className="icon icon--world" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M3.429 3.143H6.57V0a6.46 6.46 0 0 0-2.133.46 5.43 5.43 0 0 0-.54 1.076c-.2.516-.356 1.062-.47 1.607M3.336 1.376c.03-.078.062-.155.093-.233a7.155 7.155 0 0 0-2.286 2.286h1.606c.139-.7.34-1.384.587-2.053M2.356 7.429H0C.046 8.325.277 9.192.678 10H2.57c-.138-.852-.2-1.72-.215-2.571M2.571 4H.678A6.528 6.528 0 0 0 0 6.571h2.356c.015-.867.092-1.719.215-2.571M11.465 3.143h1.392a7.05 7.05 0 0 0-2-2c.015.029.03.072.045.1.237.62.43 1.252.563 1.9M11.931 6.571H14A6.861 6.861 0 0 0 13.363 4h-1.649c.13.852.203 1.704.217 2.571M10.571 3.129c-.113-.546-.27-1.091-.469-1.608A5.618 5.618 0 0 0 9.604.502 6.767 6.767 0 0 0 7.43 0v3.143h3.142v-.014zM7.429 10h3.487c.136-.852.212-1.704.227-2.571H7.429V10zM11.714 10h1.65A6.861 6.861 0 0 0 14 7.429h-2.069A19.27 19.27 0 0 1 11.714 10M10.571 10.857H7.43V14a6.682 6.682 0 0 0 2.175-.502c.2-.316.37-.66.498-1.02.2-.53.356-1.061.47-1.62M3.429 10.857c.113.54.27 1.08.469 1.607.142.384.327.74.54 1.08.683.271 1.408.413 2.133.456v-3.129l-3.142-.014zM6.857 4H3.368a18.36 18.36 0 0 0-.225 2.571h3.714V4zM10.902 12.756c-.015.044-.03.072-.045.101a7.05 7.05 0 0 0 2-2h-1.392c-.134.648-.326 1.28-.563 1.9M11.143 6.571c-.015-.867-.09-1.719-.227-2.571H7.43v2.571h3.714zM2.749 10.857H1.143a7.314 7.314 0 0 0 2.286 2.286c-.031-.078-.078-.156-.093-.233a13.525 13.525 0 0 1-.587-2.053M3.143 7.429c.015.867.09 1.719.226 2.571h3.488V7.429H3.143z" /></svg>
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

const s2p = () => ({
  selectedState: 'WY',
});

const NewContributionState = connect(s2p)(ContributionState);

export { NewContributionState };
