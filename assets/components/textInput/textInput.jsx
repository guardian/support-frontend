// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
// It can't handle props being passed to another function.
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  id: string,
  labelText: string,
  onChange: (name: string) => void,
  value: string,
  placeholder: string,
  required: boolean,
  modifierClasses: Array<?string>,
};

/* eslint-enable react/no-unused-prop-types */


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
  return (
    <div className={classNameWithModifiers('component-text-input', props.modifierClasses)}>
      <label htmlFor={props.id} className="component-text-input__label">
        {props.labelText}
      </label>
      {input}
    </div>
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  placeholder: '',
  labelText: '',
  id: null,
  required: false,
  modifierClasses: [],
};
