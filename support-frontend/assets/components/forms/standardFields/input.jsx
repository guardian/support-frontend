// @flow

// ----- Imports ----- //

import React from 'react';

import { withExtraClassName } from 'hocs/withExtraClassName';

import './input.scss';

// ----- Component ----- //

function PreInput({ forwardRef, ...props }: {forwardRef?: ?Function}) {
  return <input ref={forwardRef} {...props} />;
}

PreInput.defaultProps = { forwardRef: null };

const Input = withExtraClassName('component-input')(PreInput);


// ----- Exports ----- //

export { Input };
