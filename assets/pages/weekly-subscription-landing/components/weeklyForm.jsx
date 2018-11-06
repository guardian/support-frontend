// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import WeeklyCta from './weeklyCta';
import { subscriptions, type Subscription } from './../weeklySubscriptionLandingReducer';
import { type State } from './../weeklySubscriptionLandingReducer';
import WeeklyFormLabel from './weeklyFormLabel';

// ---- Types ----- //

type PropTypes = {|
  checked?: ?Subscription,
|};

// ----- Render ----- //

const onSubmit = (ev: Event, subscription: ?Subscription) => {
  ev.preventDefault();
  if (subscription) {
    console.log(`now leaving to the ${subscription} checkout 🚀`);
  }
};

const WeeklyForm = ({ checked }: PropTypes) => (
  <form className="weekly-form-wrap" onSubmit={(ev) => { onSubmit(ev, checked); }}>
    <div className="weekly-form">
      {Object.keys(subscriptions).map((type: Subscription) => {
         const {
          offer, copy, title,
        } = subscriptions[type];
        return (
          <div className="weekly-form__item">
            <WeeklyFormLabel title={title} offer={offer} type={type} key={type}>
              {copy}
            </WeeklyFormLabel>
          </div>

    );
})}
    </div>

    <WeeklyCta disabled={checked === null} type="submit">Subscribe now{checked && ` – ${subscriptions[checked].title}`}</WeeklyCta>
  </form>
);

WeeklyForm.defaultProps = {
  checked: null,
};

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  checked: state.page.subscription,
});

// ----- Exports ----- //

export default connect(mapStateToProps)(WeeklyForm);
