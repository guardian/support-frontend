// @flow

// ----- Imports ----- //

import React from 'react';

import './input.scss';

import { withExtraClassName } from '../formHOCs/withExtraClassName';

// ----- Component ----- //

function PreInput({ forwardRef, ...props }: {forwardRef?: ?Function}) {
  return <input ref={forwardRef} {...props} />;
}

PreInput.defaultProps = { forwardRef: null };

const Input = withExtraClassName('component-input')(PreInput);


// ----- Exports ----- //

export { Input };
