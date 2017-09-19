// @flow

// ----- Imports ----- //

import React from 'react';


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
};

/* eslint-enable react/no-unused-prop-types, react/require-default-props */


// ----- Functions ----- //

function inputClass(hasLabel: boolean): string {

  if (hasLabel) {
    return 'component-text-input__input';
  }

  return 'component-text-input';

}

function buildInput(props: PropTypes): React$Element<any> {

  const attrs = {
    className: inputClass(!!props.labelText),
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

  return (
    <div className="component-text-input">
      <label htmlFor={props.id} className="component-text-input__label">
        {props.labelText}
      </label>
      {input}
    </div>
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  placeholder: null,
  labelText: '',
  id: null,
  onChange: null,
  value: '',
  required: false,
};
