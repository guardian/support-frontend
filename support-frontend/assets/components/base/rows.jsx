// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import './rows.scss';

// ----- Types ----- //

type PropTypes = {
  gap: 'small' | 'normal' | 'large',
  children: Node,
  className: ?string,
};


// ----- Component ----- //

function Rows({
  children, className, gap, ...props
}: PropTypes) {

  return (
    <div className={[className, classNameWithModifiers('component-base-rows', [gap])].join(' ')} {...props} >
      {children}
    </div>
  );

}

Rows.defaultProps = {
  gap: 'normal',
  className: null,
};


// ----- Exports ----- //

export default Rows;
