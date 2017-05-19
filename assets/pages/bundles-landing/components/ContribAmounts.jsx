// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import {
  changeContribAmount,
  changeContribAmountRecurring,
  changeContribAmountOneOff,
} from '../actions/bundlesLandingActions';

import type { Contrib, Amounts, ContribError } from '../reducers/reducers';


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

const contribErrors = {
  tooLittleRecurring: 'Please enter at least £5',
  tooLittleOneOff: 'Please enter at least £1',
  tooMuch: 'We are presently only able to accept contributions of £2000 or less',
  noEntry: 'Please enter a numeric amount',
};


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contrib: Amounts,
  contribType: Contrib,
  contribError: ?ContribError,
  predefinedRecurringAmount: (string) => void,
  predefinedOneOffAmount: (string) => void,
  userDefinedAmount: (string) => void,
};

/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function errorMessage(error: ?ContribError) {

  if (error) {
    return <p className="contrib-amounts__error-message">{contribErrors[error]}</p>;
  }

  return null;

}

function getAttrs(props: PropTypes) {

  if (props.contribType === 'RECURRING') {

    const userDefined = props.contrib.recurring.userDefined;

    return {
      toggleAction: props.predefinedRecurringAmount,
      checked: !userDefined ? props.contrib.recurring.value : null,
      toggles: amountToggles.recurring,
      selected: props.contrib.recurring.userDefined,
    };

  }

  const userDefined = props.contrib.oneOff.userDefined;

  return {
    toggleAction: props.predefinedOneOffAmount,
    checked: !userDefined ? props.contrib.oneOff.value : null,
    toggles: amountToggles.oneOff,
    selected: props.contrib.oneOff.userDefined,
  };

}


// ----- Component ----- //

function ContribAmounts(props: PropTypes) {

  const attrs = getAttrs(props);

  return (
    <div className="contrib-amounts">
      <RadioToggle
        {...attrs.toggles}
        toggleAction={attrs.toggleAction}
        checked={attrs.checked}
      />
      <NumberInput
        onFocus={props.userDefinedAmount}
        onInput={props.userDefinedAmount}
        selected={attrs.selected}
        placeholder="Other amount (£)"
      />
      {errorMessage(props.contribError)}
    </div>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    contrib: state.contribution.amount,
    contribType: state.contribution.type,
    contribError: state.contribution.error,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    predefinedRecurringAmount: (value: string) => {
      dispatch(changeContribAmountRecurring({ value, userDefined: false }));
    },
    predefinedOneOffAmount: (value: string) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }));
    },
    userDefinedAmount: (value: string) => {
      dispatch(changeContribAmount({ value, userDefined: true }));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContribAmounts);
