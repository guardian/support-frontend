// @flow

// ----- Imports ----- //

import React from 'react';
import { getQueryParameter } from '../../helpers/url';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

export type Radio = {
  id?: string,
  value: string,
  text: string,
};

type PropTypes = {
  name: string,
  radios: Radio[],
  checked: ?string,
  toggleAction: (string) => void,
};

/* eslint-enable react/no-unused-prop-types */


// ----- Component ----- //

export default function RadioToggle(props: PropTypes) {
  const radioButtons = props.radios.map((radio: Radio, idx: number) => {

    const radioId = `${props.name}-${idx}`;
    const showAnnual = getQueryParameter('showAnnual', 'false');
    const className = showAnnual === 'true' ? 'component-radio-toggle__button--with-annual' : 'component-radio-toggle__button--without-annual';

    return (
      <span id={radio.id} className={`component-radio-toggle__button ${className}`} key={radioId}>
        <input
          className="component-radio-toggle__input"
          type="radio"
          name={props.name}
          value={radio.value}
          id={radioId}
          onChange={() => props.toggleAction(radio.value)}
          checked={radio.value === props.checked}
        />
        <label className="component-radio-toggle__label"htmlFor={radioId}>
          {radio.text}
        </label>
      </span>
    );

  });

  return <div className="component-radio-toggle">{radioButtons}</div>;

}


// ----- Proptypes ----- //

RadioToggle.defaultProps = {
  checked: '',
  id: null,
};
