// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { getValidPaymentMethods } from 'helpers/checkouts';

import { type State } from '../contributionsLandingReducer';
import { type Action, updateContributionType } from '../contributionsLandingActions';

// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  onSelectContributionType: Event => Action,
};

const mapStateToProps = (state: State) => ({
  state,
  contributionType: state.page.form.contributionType,
  countryId: state.common.internationalisation.countryId,
  switches: state.common.settings.switches,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  dispatch,
});

function mergeProps(stateProps, dispatchProps, ownProps) {

  const onSelectContributionType = (e) => {
    if (e.target.value !== 'ONE_OFF' && e.target.value !== 'MONTHLY' && e.target.value !== 'ANNUAL') { return; }
    const paymentMethodToSelect =
      getValidPaymentMethods(e.target.value, stateProps.switches, stateProps.countryId)[0] || 'None';
    dispatchProps.dispatch(updateContributionType(e.target.value, paymentMethodToSelect));
  };

  return {
    ...ownProps,
    ...stateProps,
    onSelectContributionType,
  };
}

// ----- Render ----- //

function ContributionType(props: PropTypes) {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Recurrence</legend>
      <ul className="form__radio-group-list">
        <li className="form__radio-group-item">
          <input
            id="contributionType-oneoff"
            className="form__radio-group-input"
            type="radio"
            name="contributionType"
            value="ONE_OFF"
            onChange={props.onSelectContributionType}
            checked={props.contributionType === 'ONE_OFF'}
          />
          <label htmlFor="contributionType-oneoff" className="form__radio-group-label">Single</label>
        </li>
        <li className="form__radio-group-item">
          <input
            id="contributionType-monthly"
            className="form__radio-group-input"
            type="radio"
            name="contributionType"
            value="MONTHLY"
            onChange={props.onSelectContributionType}
            checked={props.contributionType === 'MONTHLY'}
          />
          <label htmlFor="contributionType-monthly" className="form__radio-group-label">Monthly</label>
        </li>
        <li className="form__radio-group-item">
          <input
            id="contributionType-annual"
            className="form__radio-group-input"
            type="radio"
            name="contributionType"
            value="ANNUAL"
            onChange={props.onSelectContributionType}
            checked={props.contributionType === 'ANNUAL'}
          />
          <label htmlFor="contributionType-annual" className="form__radio-group-label">Annual</label>
        </li>
      </ul>
    </fieldset>
  );
}

const NewContributionType = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ContributionType);

export { NewContributionType };
