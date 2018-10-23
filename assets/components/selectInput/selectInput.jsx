// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

export type SelectOption = {
  text: string,
  value: string,
  selected?: boolean,
};

type PropTypes = {|
  options: SelectOption[],
  onChange: (string) => void,
  required: boolean,
  id: string,
  label: string,
|};


// ----- Component ----- //

export default function SelectInput(props: PropTypes) {

  const options = props.options.map((option: SelectOption) =>
    <option value={option.value} selected={option.selected}>{option.text}</option>);

  return (
    <div className="component-select-input">
      <label htmlFor={props.id} className="component-select-input__label">
        {props.label}
      </label>
      <select
        id={props.id}
        name={props.id}
        className="component-select-input__select"
        required={props.required}
        onChange={event => props.onChange(event.target.value)}
      >
        {options}
      </select>
    </div>
  );

}


// ----- Proptypes ----- //

SelectInput.defaultProps = {
  required: false,
};
