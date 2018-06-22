// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
// It can't handle props being passed to another function.
/* eslint-disable react/no-unused-prop-types, react/require-default-props */

type PropTypes = {
  placeholder?: string,
  labelText?: string,
  id?: string,
  onChange?: (name: string) => void,
  value?: string,
  required?: boolean,
  modifierClasses: Array<?string>,
};

/* eslint-enable react/no-unused-prop-types, react/require-default-props */


// ----- Functions ----- //

function inputClass(hasLabel: boolean, modifierClasses: Array<?string>): string {

  if (hasLabel) {
    return 'component-text-input__input';
  }

  return classNameWithModifiers('component-text-input', modifierClasses);

}

function buildInput(props: PropTypes): React$Element<any> {

  const attrs = {
    className: inputClass(!!props.labelText, props.modifierClasses),
    id: props.id,
    type: 'text',
    placeholder: props.placeholder,
    value: props.value || '',
    required: props.required,
  };

  // Keeps flow happy (https://github.com/facebook/flow/issues/2819).
  if (typeof props.onChange === 'function') {
    const change = props.onChange;
    return <input {...attrs} onChange={event => change(event.target.value || '')} />;
  }

  return <input {...attrs} />;

}


// ----- Component ----- //

export default function TextInput(props: PropTypes) {

  const input = buildInput(props);

  if (!props.labelText) {
    return input;
  }
  /* eslint-disable jsx-a11y/label-has-for */
  return (
    <div className={classNameWithModifiers('component-text-input', props.modifierClasses)}>
      <label htmlFor={props.id} className="component-text-input__label">
        {props.labelText}
      </label>
      {input}
    </div>
  );
  /* eslint-enable jsx-a11y/label-has-for */

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  placeholder: null,
  labelText: '',
  id: null,
  onChange: null,
  value: '',
  required: false,
  modifierClasses: [],
};
