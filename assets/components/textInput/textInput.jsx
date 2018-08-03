// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  id: string,
  labelText: string,
  onChange: (name: string) => void,
  value: string,
  placeholder: string,
  required: boolean,
  modifierClasses: Array<?string>,
  onBlur: () => void,
};


// ----- Component ----- //

export default function TextInput(props: PropTypes) {

  return (
    <div className={classNameWithModifiers('component-text-input', props.modifierClasses)}>
      <label htmlFor={props.id} className="component-text-input__label">
        {props.labelText}
      </label>
      <input
        className={classNameWithModifiers('component-text-input__input', props.modifierClasses)}
        type="text"
        id={props.id}
        onChange={event => props.onChange(event.target.value || '')}
        onBlur={props.onBlur}
        value={props.value}
        placeholder={props.placeholder}
        required={props.required}
      />
    </div>
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  placeholder: '',
  required: false,
  modifierClasses: [],
  onBlur: () => undefined,
};
