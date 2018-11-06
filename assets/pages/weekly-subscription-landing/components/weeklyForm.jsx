// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import uuidv4 from 'uuid';
import { classNameWithModifiers } from 'helpers/utilities';

import WeeklyCta from './weeklyCta';
import { type Subscription } from './../weeklySubscriptionLandingReducer';
import { type State } from './../weeklySubscriptionLandingReducer';
import { setSubscription, type Action } from './../weeklySubscriptionLandingActions';

// ---- Types ----- //

type LabelPropTypes = {|
  type: Subscription,
  title: string,
  offer?: ?string,
  children: Node,
  checked?: ?Subscription,
  setSubscriptionAction: (Subscription) => Action,
|};


// ----- Render ----- //

const PreFormLabel = ({
  type, title, offer, children, checked, setSubscriptionAction,
}: LabelPropTypes) => {
  const id = uuidv4();
  return (
    <label onChange={() => { setSubscriptionAction(type); }} className={classNameWithModifiers('weekly-form-label', [type === checked ? 'checked' : null])} htmlFor={id}>
      <input checked={type === checked} className="weekly-form-label__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="weekly-form-label__title">{title}</div>
      {offer && <div className="weekly-form-label__offer">{offer}</div>}
      <div className="weekly-form-label__copy">{children}</div>
    </label>
  );
};

PreFormLabel.defaultProps = {
  offer: null,
  checked: null,
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  checked: state.page.subscription,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setSubscriptionAction: bindActionCreators(setSubscription, dispatch),
});


const FormLabel = connect(mapStateToProps, mapDispatchToProps)(PreFormLabel);

const WeeklyForm = () => (
  <form className="weekly-form-wrap">
    <div className="weekly-form">
      <div className="weekly-form__item">
        <FormLabel title="6 for £6" offer="Introductory offer" type="weekly">
        6 issues for 6 pounds and then £37 every 3 months
        </FormLabel>
      </div>
      <div className="weekly-form__item">
        <FormLabel title="Quarterly" type="quarterly">
        6 issues for 6 pounds and then £37 every 3 months
        </FormLabel>
      </div>
      <div className="weekly-form__item">
        <FormLabel title="Annually" offer="10% off" type="annually">
        6 issues for 6 pounds and then £37 every 3 months
        </FormLabel>
      </div>
    </div>

    <WeeklyCta type="submit">Subscribe now</WeeklyCta>
  </form>
);

export default WeeklyForm;
