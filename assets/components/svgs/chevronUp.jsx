// @flow

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

type PropTypes = {|
  modifierClass?: string,
|};

// A chevron symbol pointing up, used on buttons.
export default function SvgChevronUp(props: PropTypes) {

  const className = classNameWithModifiers('svg-chevron-up', [props.modifierClass]);

  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" preserveAspectRatio="xMinYMid">
      <path d="M25.8999253 18.4499643 15.4499609 8 14.4499643 8 4 18.4499643 4.97499667 19.3999611 14.9499626 10.9999898 24.9249286 19.3999611Z" />
    </svg>
  );

}

SvgChevronUp.defaultProps = {
  modifierClass: ''
};
