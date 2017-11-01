// @flow

// ----- Imports ----- //

import React from 'react';
import uuidv4 from 'uuid';

import { generateClassName } from 'helpers/utilities';


// ----- Types ----- //

export type Radio = {
  id?: string,
  value: string,
  text: string,
  accessibilityHint?: ?string,
};

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  name: string,
  radios: Radio[],
  checked: ?string,
  toggleAction: (string) => void,
  modifierClass?: ?string,
  accessibilityHint?: ?string,
};

/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

// Builds an accessibility hint for the button.
function getA11yHint(id: string, hint: ?string) {

  return (
    <p id={id} className="accessibility-hint">
      {hint}
    </p>
  );

}

// Returns a list of the radio button elements.
function getRadioButtons(props: PropTypes) {

  return props.radios.map((radio: Radio, idx: number) => {

    const radioId = `${props.name}-${idx}`;
    const a11yHintId = `accessibility-hint-${radioId}`;

    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <span
        id={radio.id}
        className={generateClassName('component-radio-toggle__button', props.modifierClass)}
        key={radioId}
      >
        {getA11yHint(a11yHintId, radio.accessibilityHint)}
        <input
          className="component-radio-toggle__input"
          type="radio"
          name={props.name}
          value={radio.value}
          id={radioId}
          onChange={() => props.toggleAction(radio.value)}
          checked={radio.value === props.checked}
          tabIndex="0"
          aria-describedby={a11yHintId}
        />
        <label htmlFor={radioId} className="component-radio-toggle__label">
          {radio.text}
        </label>
      </span>
    );
    /* eslint-enable jsx-a11y/label-has-for */

  });

}


// ----- Component ----- //

export default function RadioToggle(props: PropTypes) {

  const radioButtons = getRadioButtons(props);
  const radioGroupId = uuidv4();

  return (
    <div>
      <div className="component-radio-toggle" aria-describedby={radioGroupId}>{radioButtons}</div>
      <p id={radioGroupId} className="accessibility-hint">{props.accessibilityHint}</p>
    </div>
  );

}


// ----- Proptypes ----- //

RadioToggle.defaultProps = {
  accessibilityHint: '',
  modifierClass: null,
};
