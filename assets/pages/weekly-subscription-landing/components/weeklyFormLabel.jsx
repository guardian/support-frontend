// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import uuidv4 from 'uuid';

import { type Subscription, type State } from '../weeklySubscriptionLandingReducer';
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
    <label onChange={() => { setSubscriptionAction(type); }} htmlFor={id} className="weekly-form-label-wrap">
      <input checked={type === checked} className="weekly-form-label-wrap__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="weekly-form-label">
        <div className="weekly-form-label__title">{title}</div>
        <div className="weekly-form-label__copy">
          {offer && <div className="weekly-form-label__offer">{offer}</div>}
          {children}
        </div>
      </div>
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
