// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import './rows.scss';

// ----- Types ----- //

type PropTypes = {
  gap: 'small' | 'normal' | 'large',
  children: Node
};


// ----- Component ----- //

function Rows({ children, gap, ...props }: PropTypes) {

  return (
    <div className={classNameWithModifiers('component-base-rows', [gap])} {...props} >
      {children}
    </div>
  );

}

Rows.defaultProps = {
  gap: 'normal',
};


// ----- Exports ----- //

export default Rows;
