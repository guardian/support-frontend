// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  onFocus: (string) => void,
  onInput: (string) => void,
  selected: ?boolean,
  placeholder: ?string,
  onKeyPress: ?(event: Object) => void,
  ariaDescribedBy: ?string,
};


// ----- Component ----- //

export default function NumberInput(props: PropTypes) {

  const selectedClass = props.selected ? ' component-number-input--selected' : '';

  return (
    <input
      className={`component-number-input${selectedClass}`}
      type="number"
      placeholder={props.placeholder}
      onFocus={e => props.onFocus(e.target.value || '')}
      onInput={e => props.onInput(e.target.value || '')}
      onKeyPress={props.onKeyPress}
      aria-describedby={props.ariaDescribedBy}
    />
  );

}
