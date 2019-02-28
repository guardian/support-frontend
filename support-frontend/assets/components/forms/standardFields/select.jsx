// @flow

// ----- Imports ----- //

import React from 'react';

import './select.scss';


// ----- Component ----- //

function Select({ forwardRef, ...props }: {forwardRef?: ?Function}) {
  return <select ref={forwardRef} className="component-select" {...props} />;
}


// ----- Exports ----- //
Select.defaultProps = { forwardRef: null };

export { Select };
