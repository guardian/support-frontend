// @flow

import React from 'react';
import { gridUrl } from 'helpers/theGrid';

export default function AmberZuck() {
  const amberUrl = gridUrl('amberRudd', 500, 'png');
  const zuckUrl = gridUrl('zuck', 500, 'png');
  return (
    <svg className="svg-amber-zuck" xmlns="http://www.w3.org/2000/svg" width="576" height="220" viewBox="0 0 576 220">
      <path fill="#E2E2E2" d="M465.552 219C405.077 219 357 169.975 357 109.5S406.025 0 466.5 0 576 49.025 576 109.5 526.027 219 465.552 219z" />
      <circle cx="249" cy="152" r="25" fill="#FFE500" transform="matrix(-1 0 0 1 498 0)" />
      <circle cx="29.5" cy="190.5" r="29.5" fill="#FFABDB" transform="matrix(-1 0 0 1 59 0)" />
      <circle cx="320" cy="171" r="49" fill="#00B2FF" transform="matrix(-1 0 0 1 640 0)" />
      <image href={zuckUrl} x="41" y="33" height="186" width="186" />
      <image href={amberUrl} x="217" y="12" height="119" width="119" />
    </svg>
  );
}
