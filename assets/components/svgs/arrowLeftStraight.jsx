// @flow

import React from 'react';

// The right-pointing arrow commonly used on CTAs.
export default function SvgArrowLeftStraight() {
  const reverseStyle = {
    transform: 'rotate(180deg)',
  };
  return (
    <svg
      className="svg-arrow-left-straight"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 17.89"
      style={reverseStyle}
      preserveAspectRatio="xMinYMid"
    >
      <path d="M20 9.35l-9.08 8.54-.86-.81 6.54-7.31H0V8.12h16.6L10.06.81l.86-.81L20 8.51v.84z" />
    </svg>
  );
}
