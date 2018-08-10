// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type AutoComplete = 'on' | 'off';

type AutoCapitalize = 'off'
                    | 'none'
                    | 'on'
                    | 'sentences'
                    | 'words';

type InputType = 'text'
               | 'email'
               | 'password'
               | 'url'
               | 'tel';

type PropTypes = {
  id: string,
  type: InputType,
  labelText: string,
  onChange: (name: string) => void,
  value: string,
  placeholder: string,
  required: boolean,
  autocomplete?: AutoComplete,
  autocapitalize?: AutoCapitalize,
  pattern?: string,
  modifierClasses: Array<?string>,
  onBlur: () => void,
  pattern?: string,
  type: ?string,
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
        type={props.type}
        pattern={props.pattern}
        id={props.id}
        onChange={event => props.onChange(event.target.value || '')}
        onBlur={props.onBlur}
        value={props.value}
        placeholder={props.placeholder}
        required={props.required}
        autoComplete={props.autocomplete}
        autoCapitalize={props.autocapitalize}
      />
    </div>
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  type: 'text',
  placeholder: '',
  required: false,
  autocomplete: 'on',
  autocapitalize: 'off',
  modifierClasses: [],
  pattern: '.*',
  onBlur: () => undefined,
};
