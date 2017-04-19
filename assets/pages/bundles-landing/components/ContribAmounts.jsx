// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import RadioToggle from 'components/radioToggle/radioToggle';
import TextInput from 'components/textInput/textInput';
import {
  changeContribAmountRecurring,
  changeContribAmountOneOff,
} from '../actions/bundlesLandingActions';


// ----- Setup ----- //

const amountToggles = {
  recurring: {
    name: 'contributions-amount-recurring-toggle',
    radios: [
      {
        value: '5',
        text: '£5',
      },
      {
        value: '10',
        text: '£10',
      },
      {
        value: '20',
        text: '£20',
      },
    ],
  },
  oneOff: {
    name: 'contributions-amount-oneoff-toggle',
    radios: [
      {
        value: '25',
        text: '£25',
      },
      {
        value: '50',
        text: '£50',
      },
      {
        value: '100',
        text: '£100',
      },
      {
        value: '250',
        text: '£250',
      },
    ],
  },
};


// ----- Component ----- //

function ContribAmounts(props) {

  if (props.contribType === 'RECURRING') {

    const checked = !props.contrib.recurring.userDefined ? props.contrib.recurring.amount : null;

    return (
      <div className="contrib-amounts">
        <RadioToggle
          {...amountToggles.recurring}
          toggleAction={props.predefinedRecurringAmount}
          checked={checked}
        />
        <TextInput
          onFocus={props.userDefinedRecurringAmount}
          onChange={props.userDefinedRecurringAmount}
          selected={props.contrib.recurring.userDefined}
        />
      </div>
    );

  }

  const checked = !props.contrib.oneOff.userDefined ? props.contrib.oneOff.amount : null;

  return (
    <div className="contrib-amounts">
      <RadioToggle
        {...amountToggles.oneOff}
        toggleAction={props.predefinedOneOffAmount}
        checked={checked}
      />
      <TextInput
        onFocus={props.userDefinedOneOffAmount}
        onChange={props.userDefinedOneOffAmount}
        selected={props.contrib.oneOff.userDefined}
      />
    </div>
  );

}


// ----- Proptypes ----- //

ContribAmounts.propTypes = {
  contribType: React.PropTypes.string.isRequired,
  contrib: React.PropTypes.shape({
    recurring: React.PropTypes.shape({
      amount: React.PropTypes.string.isRequired,
      userDefined: React.PropTypes.bool.isRequired,
    }).isRequired,
    oneOff: React.PropTypes.shape({
      amount: React.PropTypes.string.isRequired,
      userDefined: React.PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  predefinedRecurringAmount: React.PropTypes.func.isRequired,
  predefinedOneOffAmount: React.PropTypes.func.isRequired,
  userDefinedRecurringAmount: React.PropTypes.func.isRequired,
  userDefinedOneOffAmount: React.PropTypes.func.isRequired,
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    contrib: state.contribAmount,
    contribType: state.contribType,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    predefinedRecurringAmount: (amount) => {
      dispatch(changeContribAmountRecurring({ amount, userDefined: false }));
    },
    predefinedOneOffAmount: (amount) => {
      dispatch(changeContribAmountOneOff({ amount, userDefined: false }));
    },
    userDefinedRecurringAmount: (amount) => {
      dispatch(changeContribAmountRecurring({ amount, userDefined: true }));
    },
    userDefinedOneOffAmount: (amount) => {
      dispatch(changeContribAmountOneOff({ amount, userDefined: true }));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContribAmounts);
