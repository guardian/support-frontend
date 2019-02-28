// @flow

// ----- Imports ----- //

import React from 'react';

import './input.scss';

// ----- Component ----- //

function Input({ forwardRef, ...props }: {forwardRef?: ?Function}) {
  return <input ref={forwardRef} className="component-input" {...props} />;
}

Input.defaultProps = { forwardRef: null };


// ----- Exports ----- //

export { Input };
