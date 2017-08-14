// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import {
  generateClassName,
  clickSubstituteKeyPressHandler,
} from 'helpers/utilities';
import { CONFIG as contribConfig } from 'helpers/contributions';
import type { Contrib, ContribError, Amounts } from 'helpers/contributions';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { forCountry } from 'helpers/internationalisation/currency';
import type { Currency } from 'helpers/internationalisation/currency';

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
} = (isoCountry: IsoCountry) => {
  return {
      RECURRING: {
          name: 'contributions-amount-recurring-toggle',
          radios: amountRadiosRecurring[isoCountry]
      },
      ONE_OFF: {
          name: 'contributions-amount-oneoff-toggle',
          radios: amountRadiosOneOff[isoCountry]
      },
  };
};

const amountRadiosRecurring = {
    GB: [
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
    US: [
        {
            value: '5',
            text: '$5',
        },
        {
            value: '10',
            text: '$10',
        },
        {
            value: '20',
            text: '$20',
        },
    ],
};

const amountRadiosOneOff = {
    GB: [
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
    US: [
        {
            value: '25',
            text: '$25',
        },
        {
            value: '50',
            text: '$50',
        },
        {
            value: '100',
            text: '$100',
        },
        {
            value: '250',
            text: '$250',
        },
    ],
};

const contribToggle: Toggle = (isoCountry: IsoCountry) => {
  return {
      name: 'contributions-period-toggle',
      radios: contribCaptionRadios[isoCountry]
  };
};

const contribCaptionRadios = {
  GB: [
      {
          value: 'RECURRING',
          text: 'Monthly',
      },
      {
          value: 'ONE_OFF',
          text: 'One-off',
      },
  ],
  US: [
      {
          value: 'RECURRING',
          text: 'Monthly',
      },
      {
          value: 'ONE_OFF',
          text: 'One-time',
      },
  ],
};


// ----- Functions ----- //

function errorMessage(
  error: ?ContribError,
  contribType: Contrib,
  isoCountry: IsoCountry
): ?React$Element<any> {

  const limits = contribConfig[contribType];
  const currencyGlyph = forCountry(isoCountry).glyph;

  const contribErrors: {
    [ContribError]: string,
  } = {
    tooLittle: `Please enter at least ${currencyGlyph}${limits.min}`,
    tooMuch: `We are presently only able to accept contributions of ${currencyGlyph}${limits.max} or less`,
    invalidEntry: 'Please enter a numeric amount',
  };

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
      toggles: amountToggles(props.isoCountry).RECURRING,
      selected: props.contribAmount.recurring.userDefined,
      contribType: props.contribType,
    };

  }

  const userDefined = props.contribAmount.oneOff.userDefined;

  return {
    toggleAction: props.changeContribOneOffAmount,
    checked: !userDefined ? props.contribAmount.oneOff.value : null,
    toggles: amountToggles(props.isoCountry).ONE_OFF,
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
          {...contribToggle(props.isoCountry)}
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
            placeholder={"Other amount (" + forCountry(props.isoCountry).glyph + ")"}
            onKeyPress={clickSubstituteKeyPressHandler(props.onNumberInputKeyPress)}
          />
        </div>
        {errorMessage(props.contribError, attrs.contribType, props.isoCountry)}
      </div>
    </div>
  );

}
