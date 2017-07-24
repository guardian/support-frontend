// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import {
  generateClassName,
  clickSubstituteKeyPressHandler,
} from 'helpers/utilities';
import type { Contrib, ContribError, Amounts } from 'helpers/contributions';
import type { Radio } from 'components/radioToggle/radioToggle';


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

type Toggle = {
  name: string,
  radios: Radio[],
};

type ContribAttrs = {
  toggleAction: (string) => void,
  checked: ?string,
  toggles: Toggle,
  selected: boolean,
  contribType: Contrib,
};


// ----- Setup ----- //

const amountToggles: {
  [Contrib]: Toggle,
} = {
  RECURRING: {
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
  ONE_OFF: {
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

const contribToggle: Toggle = {
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

const contribErrors: {
  [ContribError]: string,
} = {
  tooLittleRecurring: 'Please enter at least £5',
  tooLittleOneOff: 'Please enter at least £1',
  tooMuch: 'We are presently only able to accept contributions of £2000 or less',
  invalidEntry: 'Please enter a numeric amount',
};


// ----- Functions ----- //

function errorMessage(error: ?ContribError): ?React$Element<any> {

  if (error) {
    return <p className="component-contrib-amounts__error-message">{contribErrors[error]}</p>;
  }

  return null;

}

function getAttrs(props: PropTypes): ContribAttrs {

  if (props.contribType === 'RECURRING') {

    const userDefined = props.contribAmount.recurring.userDefined;

    return {
      toggleAction: props.changeContribRecurringAmount,
      checked: !userDefined ? props.contribAmount.recurring.value : null,
      toggles: amountToggles.RECURRING,
      selected: props.contribAmount.recurring.userDefined,
      contribType: props.contribType,
    };

  }

  const userDefined = props.contribAmount.oneOff.userDefined;

  return {
    toggleAction: props.changeContribOneOffAmount,
    checked: !userDefined ? props.contribAmount.oneOff.value : null,
    toggles: amountToggles.ONE_OFF,
    selected: props.contribAmount.oneOff.userDefined,
    contribType: props.contribType,
  };

}


// ----- Component ----- //

export default function ContribAmounts(props: PropTypes) {

  const attrs = getAttrs(props);
  const className = generateClassName(
    'component-contrib-amounts__amounts',
    attrs.contribType === 'ONE_OFF' ? 'one-off' : 'recurring',
  );

  return (
    <div className="component-contrib-amounts">
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
        <div className="component-contrib-amounts__other-amount">
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
