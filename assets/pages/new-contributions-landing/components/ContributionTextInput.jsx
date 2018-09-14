// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  id: string,
  name: string,
  label: string,
  placeholder: boolean | string,
  icon: ?React$Element<*>,
  type?: string,
  value: string | null,
  // checkValidity: (HTMLInputElement => boolean) | null,
  // errorMessage: string | null,
  onInput: (Event => void) | false,
  required?: boolean,
};

// ----- Render ----- //

function ContributionTextInput(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('form__field', [props.name])}>
      <label className="form__label" htmlFor={props.id}>{props.label}</label>
      {props.icon ? (
        <span className="form__input-with-icon">
          <input
            id={props.id}
            className="form__input"
            type={props.type}
            autoCapitalize="words"
            required={props.required}
            placeholder={props.placeholder}
            onInput={props.onInput}
            value={props.value}
          />
          <span className="form__icon">
            {props.icon}
          </span>
        </span>
      ) : (
        <input
          id={props.id}
          className="form__input"
          type={props.type}
          autoCapitalize="words"
          required={props.required}
          placeholder={props.placeholder}
        />
      )}
    </div>
  );
}

ContributionTextInput.defaultProps = {
  type: 'text',
  placeholder: false,
  required: false,
  onInput: false,
  value: null,
};

const NewContributionTextInput = connect()(ContributionTextInput);

export { NewContributionTextInput };
