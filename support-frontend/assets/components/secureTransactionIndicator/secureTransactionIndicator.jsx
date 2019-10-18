// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import './secureTransactionIndicator.scss';
import SecurePadlock from './securePadlock.svg';

// ----- Component ----- //

type PropTypes = {
  text: string,
  modifierClasses: Array<?string>,
}

export default function SecureTransactionIndicator(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('component-secure-transaction', [...props.modifierClasses])}>
      <SecurePadlock className="component-secure-transaction__padlock" />
      <div className="component-secure-transaction__text">{props.text}</div>
    </div>
  );
}

SecureTransactionIndicator.defaultProps = {
  modifierClasses: [],
};
