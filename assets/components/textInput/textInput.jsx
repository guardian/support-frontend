// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';
import ErrorMessage from 'components/errorMessage/errorMessage';


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
  autocomplete?: AutoComplete,
  autocapitalize?: AutoCapitalize,
  modifierClasses: Array<?string>,
  onBlur: () => void,
  showError: boolean,
  errorMessage: string,
};


// ----- Component ----- //

export default function TextInput(props: PropTypes) {

  const { modifierClasses } = props;
  if (props.showError) {
    modifierClasses.push('error');
  }

  return (
      <div className={classNameWithModifiers('component-text-input', modifierClasses)}>
        <label htmlFor={props.id} className="component-text-input__label">
          {props.labelText}
        </label>
        <input
          className={classNameWithModifiers('component-text-input__input', modifierClasses)}
          type={props.type}
          id={props.id}
          onChange={event => props.onChange(event.target.value || '')}
          onBlur={props.onBlur}
          value={props.value}
          placeholder={props.placeholder}
          autoComplete={props.autocomplete}
          autoCapitalize={props.autocapitalize}
        />
        <ErrorMessage
          showError={props.showError}
          message={props.errorMessage}
        />
      </div>
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  type: 'text',
  placeholder: '',
  autocomplete: 'on',
  autocapitalize: 'off',
  modifierClasses: [],
  onBlur: () => undefined,
};
