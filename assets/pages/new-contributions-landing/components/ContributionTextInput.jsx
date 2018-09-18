// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  id: string,
  name: string,
  label: string,
  placeholder: boolean | string,
  icon: React$Element<*>,
  type?: string,
  value: string | null,
  errorMessage: string | null,
  isValid: boolean,
  wasBlurred: boolean,
  onInput: (Event => void) | void,
  onBlur: (Event => void) | void,
  required?: boolean,
  autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words',
  autoComplete: 'off' | 'on' | 'name' | 'given-name' | 'family-name' | 'email',
  autoFocus: boolean,
  min: number | void,
  max: number | void,
};

// ----- Render ----- //

function NewContributionTextInput(props: PropTypes) {
  const showError = props.value !== '' && !props.isValid && props.wasBlurred;

  return (
    <div className={classNameWithModifiers('form__field', [props.name])}>
      <label className="form__label" htmlFor={props.id}>
        {props.label}
      </label>
      <span className="form__input-with-icon">
        <input
          id={props.id}
          className={classNameWithModifiers('form__input', showError ? ['invalid'] : [])}
          type={props.type}
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          required={props.required}
          placeholder={props.placeholder}
          onInput={props.onInput}
          onBlur={props.onBlur}
          value={props.value}
          min={props.min}
          max={props.max}
        />
        <span className="form__icon">
          {props.icon}
        </span>
      </span>
      {showError ? (
        <div className="form__error">
          {props.errorMessage}
        </div>
      ) : null}
    </div>
  );
}

NewContributionTextInput.defaultProps = {
  type: 'text',
  placeholder: false,
  required: false,
  onInput: undefined,
  onBlur: undefined,
  value: null,
  autoCapitalize: 'none',
  autoComplete: 'on',
  autoFocus: false,
  max: undefined,
  min: undefined,
};

export { NewContributionTextInput };
