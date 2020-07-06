// @flow
import React from 'react';

type PropTypes = {|
  d: string,
  territory: string,
  type: string,
|};

export const MapPath = (props: PropTypes) => (
  <path
    className={props.type}
    d={props.d}
  />
);
