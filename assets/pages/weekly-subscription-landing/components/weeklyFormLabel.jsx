// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import uuidv4 from 'uuid';

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { type State } from '../weeklySubscriptionLandingReducer';
import { setPeriod, type Action } from '../weeklySubscriptionLandingActions';

// ---- Types ----- //

type PropTypes = {|
  type: WeeklyBillingPeriod,
  title: string,
  offer?: ?string,
  children: Node,
  checked?: ?WeeklyBillingPeriod,
  setPeriodAction: (WeeklyBillingPeriod) => Action,
|};


// ----- Render ----- //

const WeeklyFormLabel = ({
  type, title, offer, children, checked, setPeriodAction,
}: PropTypes) => {
  const id = uuidv4();
  return (
    <label onChange={() => { setPeriodAction(type); }} htmlFor={id} className="weekly-form-label-wrap">
      <input checked={type === checked} className="weekly-form-label-wrap__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="weekly-form-label">
        <div className="weekly-form-label__title">{title}</div>
        {offer && <div className="weekly-form-label__offer">{offer}</div>}
        <div className="weekly-form-label__copy">{children}</div>
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
  checked: state.page.period,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setPeriodAction: bindActionCreators(setPeriod, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(WeeklyFormLabel);
