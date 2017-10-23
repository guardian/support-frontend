// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  id: ?string,
  onChange: (preference: boolean) => void,
  checked: boolean,
  labelText?: string,
};


// ----- Component ----- //

export default function CheckboxInput(props: PropTypes) {
  let label = '';

  if (props.labelText && props.id) {
    label = <label htmlFor={props.id}>{props.labelText}</label>;
  }
  return (
    <div className="component-checkbox">
      <input
        id={props.id}
        type="checkbox"
        onChange={e => props.onChange(e.target.checked)}
        checked={props.checked}
      />
      {label}
    </div>
  );
}

CheckboxInput.defaultProps = {
  labelText: '',
};
