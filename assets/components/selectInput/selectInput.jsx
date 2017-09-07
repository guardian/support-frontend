// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
// It can't handle props being passed to another function.
/* eslint-disable react/no-unused-prop-types, react/require-default-props */

export type SelectOption = {
  text: string,
  value: string,
};

/* eslint-enable react/no-unused-prop-types, react/require-default-props */

type PropTypes = {
  options: SelectOption[],
  onChange: (value: string) => void,
  required?: boolean,
  id?: string
};


// ----- Component ----- //

export default function SelectInput(props: PropTypes) {

  const options = props.options.map((option: SelectOption) =>
    <option value={option.value}>{option.text}</option>,
  );

  return (
    <select
      id={props.id}
      className="component-select-input"
      required={props.required}
      onChange={event => props.onChange(event.target.value)}
    >
      {options}
    </select>
  );

}


// ----- Proptypes ----- //

SelectInput.defaultProps = {
  required: false,
  id: null,
};
