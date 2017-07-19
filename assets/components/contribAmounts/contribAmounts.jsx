// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';


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

const contribToggle = {
  name: 'contributions-period-toggle',
  radios: [
    {
      value: 'RECURRING',
      text: 'Monthly',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
    },
  ],
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
  contribAmount: Amounts,
  contribType: Contrib,
  contribError: ?ContribError,
  changeContribRecurringAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  toggleContribType: (string) => void,
  onNumberInputKeyPress: () => void,
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

    const userDefined = props.contribAmount.recurring.userDefined;

    return {
      toggleAction: props.changeContribRecurringAmount,
      checked: !userDefined ? props.contribAmount.recurring.value : null,
      toggles: amountToggles.recurring,
      selected: props.contribAmount.recurring.userDefined,
      contribType: 'recurring',
    };

  }

  const userDefined = props.contribAmount.oneOff.userDefined;

  return {
    toggleAction: props.changeContribOneOffAmount,
    checked: !userDefined ? props.contribAmount.oneOff.value : null,
    toggles: amountToggles.oneOff,
    selected: props.contribAmount.oneOff.userDefined,
    contribType: 'one-off',
  };

}


// ----- Component ----- //

export default function ContribAmounts(props: PropTypes) {
  const attrs = getAttrs(props);
  const className = `contrib-amounts contrib-amounts--${attrs.contribType}`;

  return (
    <div>
      <div className="contrib-type">
        <RadioToggle
          {...contribToggle}
          toggleAction={props.toggleContribType}
          checked={props.contribType}
        />
      </div>
      <div className={className}>
        <RadioToggle
          {...attrs.toggles}
          toggleAction={attrs.toggleAction}
          checked={attrs.checked}
        />
        <div className="contrib-amounts__other-amount">
          <NumberInput
            onFocus={props.changeContribAmount}
            onInput={props.changeContribAmount}
            selected={attrs.selected}
            placeholder="Other amount (£)"
            onKeyPress={clickSubstituteKeyPressHandler(props.onNumberInputKeyPress)}
          />
        </div>
        {errorMessage(props.contribError)}
      </div>
    </div>
  );

}
