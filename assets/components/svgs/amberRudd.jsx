// @flow

import React from 'react';
import { gridUrl } from 'helpers/theGrid';

export default function AmberRudd() {
  const imageUrl = gridUrl('amberRudd', '370', 'png');
  return (
    <svg
      className="svg-amber-rudd"
      height="412"
      width="404"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="273" cy="35" fill="#FFABDB" r="26" />
      <circle cx="349.5" cy="53.5" fill="#FFE501" r="52.5" />
      <image xlinkHref={imageUrl} y="42" height="370" width="370" />
    </svg>
  );
}
