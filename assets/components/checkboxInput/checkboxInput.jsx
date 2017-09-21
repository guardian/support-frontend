// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  id: string,
  onChange: (event: Object) => void,
  labelText?: string,
};


// ----- Component ----- //

export default function CheckboxInput(props: PropTypes) {
  let label = '';

  if (props.labelText) {
    label = <label htmlFor={props.id}>{props.labelText}</label>;
  }
  return (
    <div className={'component-checkbox'}>
      <input
        id={props.id}
        type="checkbox"
        onChange={e => props.onChange(e.target.value)}
      />
      {label}
    </div>
  );
}

CheckboxInput.defaultProps = {
  labelText: '',
};
