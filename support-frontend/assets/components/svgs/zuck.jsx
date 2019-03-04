// @flow

import React from 'react';
import { gridUrl } from 'helpers/theGrid';

export default function Zuck() {
  const imageUrl = gridUrl('zuck', 374, 'png');
  return (
    <svg className="svg-zuck" height="412" width="404" xmlns="http://www.w3.org/2000/svg">
      <circle cx="236" cy="34" r="33" fill="#00B2FF" />
      <circle cx="121.5" cy="324.5" r="21.5" fill="#FFE501" />
      <circle cx="205" cy="329" r="64" fill="#FF4D2B" />
      <image href={imageUrl} y="25" height="255" width="255" />
    </svg>
  );
}
