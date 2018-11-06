// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import SvgInfo from 'components/svgs/information';
import { type WeeklyBillingPeriod } from 'helpers/subscriptions';

import WeeklyCta from './weeklyCta';
import { billingPeriods, type State } from '../weeklySubscriptionLandingReducer';
import WeeklyFormLabel from './weeklyFormLabel';


// ---- Types ----- //

type PropTypes = {|
  checked?: ?WeeklyBillingPeriod,
|};

// ----- Render ----- //

const onSubmit = (ev: Event, period: ?WeeklyBillingPeriod) => {
  ev.preventDefault();
  if (period) {
    console.log(`now leaving to the ${period} checkout 🚀`);
  }
};

const WeeklyForm = ({ checked }: PropTypes) => (
  <form className="weekly-form-wrap" onSubmit={(ev) => { onSubmit(ev, checked); }}>
    <div className="weekly-form">
      {Object.keys(billingPeriods).map((type: WeeklyBillingPeriod) => {
        const {
          offer, copy, title,
        } = billingPeriods[type];
        return (
          <div className="weekly-form__item">
            <WeeklyFormLabel title={title} offer={offer} type={type} key={type}>
              {copy}
            </WeeklyFormLabel>
          </div>
          );
        })}
    </div>

    <WeeklyCta disabled={checked === null} type="submit">
      Subscribe now{checked && ` – ${billingPeriods[checked].title}`}
    </WeeklyCta>

    <div className="weekly-form__info">
      <SvgInfo />
      You can cancel your subscription at any time
    </div>
  </form>
);

WeeklyForm.defaultProps = {
  checked: null,
};

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  checked: state.page.period,
});

// ----- Exports ----- //

export default connect(mapStateToProps)(WeeklyForm);
