// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';


// ----- Setup ----- //

const modifierClass = 'monthly-contrib__amount--wide-value';


// ----- Types ----- //

type PropTypes = {
  amount: number,
};


// ----- Component ----- //

function ContribAmount(props: PropTypes) {

  const wideValue = props.amount.toString().length > 2;
  const className = `monthly-contrib__amount ${wideValue ? modifierClass : ''}`;
  const printedAmount = wideValue ? props.amount.toFixed(2) : props.amount;

  return (
    <div className={className}>£{printedAmount}</div>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    amount: state.monthlyContrib.amount,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContribAmount);
