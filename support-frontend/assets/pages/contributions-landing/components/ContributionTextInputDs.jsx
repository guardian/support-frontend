// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';
import { TextInput } from '@guardian/src-text-input';


// ----- Types ----- //

type PropTypes = {|
  id: string,
  name: string,
  label: string,
  supporting: string | null,
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

export default function ContributionTextInputDs(props: PropTypes) {
  const showError = !props.isValid && props.formHasBeenSubmitted;

  return (
    <div className={classNameWithModifiers('form__field', [props.name])}>
      <span>
        <TextInput
          label={props.label}
          id={props.id}
          type={props.type}
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          optional={!props.required}
          onInput={props.onInput}
          onChange={props.onChange}
          value={props.value}
          min={props.min}
          max={props.max}
          pattern={props.pattern}
          step={props.step}
          disabled={props.disabled}
          error={showError && props.errorMessage}
          supporting={!showError && props.supporting}
          cssOverrides={{
            width: 'calc(100% - 20px)',
          }}
        />
      </span>
    </div>
  );
}

ContributionTextInputDs.defaultProps = {
  type: 'text',
  supporting: null,
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
