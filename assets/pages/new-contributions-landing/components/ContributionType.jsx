// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Contrib } from 'helpers/contributions';

// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  labels: {
    ONE_OFF: string,
    MONTHLY: string,
    ANNUAL: string
  }
};

const mapStateToProps = () => ({
  contributionType: 'MONTHLY',
  labels: {
    ANNUAL: 'Annually',
    MONTHLY: 'Monthly',
    ONE_OFF: 'Single',
  },
});

// ----- Render ----- //

function ContributionType(props: PropTypes) {
  return (
    <fieldset className="form__radio-group form__radio-group--tabs form__radio-group--contribution-type">
      <legend className="form__legend form__legend--radio-group">Recurrence</legend>
      <ul className="form__radio-group-list">
        <li className="form__radio-group-item">
          <input id="contributionType-oneoff" className="form__radio-group-input" type="radio" name="contributionType" value="ONE_OFF" checked={props.contributionType === 'ONE_OFF'} />
          <label htmlFor="contributionType-oneoff" className="form__radio-group-label">{props.labels.ONE_OFF}</label>
        </li>
        <li className="form__radio-group-item">
          <input id="contributionType-monthly" className="form__radio-group-input" type="radio" name="contributionType" value="MONTHLY" checked={props.contributionType === 'MONTHLY'} />
          <label htmlFor="contributionType-monthly" className="form__radio-group-label">{props.labels.MONTHLY}</label>
        </li>
        <li className="form__radio-group-item">
          <input id="contributionType-annual" className="form__radio-group-input" type="radio" name="contributionType" value="ANNUAL" checked={props.contributionType === 'ANNUAL'} />
          <label htmlFor="contributionType-annual" className="form__radio-group-label">{props.labels.ANNUAL}</label>
        </li>
      </ul>
    </fieldset>
  );
}

const NewContributionType = connect(mapStateToProps)(ContributionType);

export { NewContributionType };
