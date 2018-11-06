// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import uuidv4 from 'uuid';
import { classNameWithModifiers } from 'helpers/utilities';

import { type Subscription } from '../weeklySubscriptionLandingReducer';
import { type State } from '../weeklySubscriptionLandingReducer';
import { setSubscription, type Action } from '../weeklySubscriptionLandingActions';

// ---- Types ----- //

type PropTypes = {|
  type: Subscription,
  title: string,
  offer?: ?string,
  children: Node,
  checked?: ?Subscription,
  setSubscriptionAction: (Subscription) => Action,
|};


// ----- Render ----- //

const WeeklyFormLabel = ({
  type, title, offer, children, checked, setSubscriptionAction,
}: PropTypes) => {
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

WeeklyFormLabel.defaultProps = {
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


export default connect(mapStateToProps, mapDispatchToProps)(WeeklyFormLabel);
