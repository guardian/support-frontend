// @flow

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

import './veggieButton.scss';


type PropTypes = {|
  children: Node,
  label: string,
  'aria-haspopup': Option<string>,
  onClick: Option<Function>,
  getRef: Option<Function>,
  style: Option<{}>
|}

const VeggieButton = ({
  children, label, getRef, ...otherProps
}: PropTypes) =>
  (
    <button
      className="component-header-veggie-button"
      ref={getRef}
      {...otherProps}
    >
      <span className="accessibility-hint">{label}</span>
      {children}
    </button>
  );

VeggieButton.defaultProps = {
  'aria-haspopup': null, // eslint-disable-line react/default-props-match-prop-types
  onClick: null,
  style: null,
  getRef: null,
};

export default VeggieButton;
