// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {|
  id: string,
  name: string,
  label: string,
  placeholder: boolean | string,
  icon: React$Element<*>,
  type?: string,
  value: string | null,
  errorMessage: string | null,
  isValid: boolean,
  formHasBeenSubmitted: boolean,
  onInput: (Event => void) | void,
  onChange?: (Event => void),
  required?: boolean,
  autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words',
  autoComplete: 'off' | 'on' | 'name' | 'given-name' | 'family-name' | 'email',
  autoFocus: boolean,
  min: number | void,
  max: number | void,
  step: number | void,
  pattern: string | void,
  disabled: boolean,
|};

// ----- Render ----- //

function NewContributionTextInput(props: PropTypes) {
  const showError = !props.isValid && props.formSubmitted;
  const modifiersArray = showError ? ['invalid', props.id] : [props.id];

  return (
    <div className={classNameWithModifiers('form__field', [props.name])}>
      <label className="form__label" htmlFor={props.id}>
        {props.label}
      </label>
      <span className="form__input-with-icon">
        <input
          id={props.id}
          className={classNameWithModifiers('form__input', modifiersArray)}
          type={props.type}
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          required={props.required}
          placeholder={props.placeholder}
          onInput={props.onInput}
          onChange={props.onChange}
          value={props.value}
          min={props.min}
          max={props.max}
          pattern={props.pattern}
          step={props.step}
          disabled={props.disabled}
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
  onChange: () => {},
  value: null,
  autoCapitalize: 'none',
  autoComplete: 'on',
  autoFocus: false,
  max: undefined,
  min: undefined,
  step: undefined,
  pattern: undefined,
  disabled: false,
  formHasBeenSubmitted: false,
  isValid: true,
};

export { NewContributionTextInput };
