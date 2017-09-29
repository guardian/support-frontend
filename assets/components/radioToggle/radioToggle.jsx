// @flow

// ----- Imports ----- //

import React from 'react';
import { UUID } from 'helpers/utilities';

// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

export type Radio = {
  id?: string,
  value: string,
  text: string,
  accessibilityHint?: string,
};

type PropTypes = {
  name: string,
  radios: Radio[],
  checked: ?string,
  toggleAction: (string) => void,
  showAnnual: boolean,
  accessibilityHint: ?string,
};

/* eslint-enable react/no-unused-prop-types */

function getClassName(props: PropTypes) {
  return props.showAnnual === true ? 'component-radio-toggle__button--with-annual' : 'component-radio-toggle__button--without-annual';
}
// ----- Component ----- //

export default function RadioToggle(props: PropTypes) {
  const radioButtons = props.radios.map((radio: Radio, idx: number) => {

    const radioId = `${props.name}-${idx}`;
    const className = getClassName(props);
    const accessibilityHintId = `accessibility-hint-${radioId}`;
    const accessibilityHint = <div id={accessibilityHintId} className="accessibility-hint">{radio.accessibilityHint}</div>;
    return (
      <span id={radio.id} className={`component-radio-toggle__button ${className}`} key={radioId}>
        {accessibilityHint}
        <input
          className="component-radio-toggle__input"
          type="radio"
          name={props.name}
          value={radio.value}
          id={radioId}
          onChange={() => props.toggleAction(radio.value)}
          checked={radio.value === props.checked}
          tabIndex="0"
          aria-describedby={accessibilityHintId}
        />
        <label className="component-radio-toggle__label" htmlFor={radioId} >
          {radio.text}
        </label>
      </span>
    );

  });

  const radioGroupId = UUID();

  return (
    <span>
      <div className="component-radio-toggle" aria-describedby={radioGroupId}>{radioButtons}</div>
      <div id={radioGroupId} className="accessibility-hint">{props.accessibilityHint}</div>
    </span>
  );

}


// ----- Proptypes ----- //

RadioToggle.defaultProps = {
  checked: '',
  id: null,
  accessibilityHint: null,
};
