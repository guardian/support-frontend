// @flow

// ----- Imports ----- //

import React from 'react';
import IntroductionText from 'components/introductionText/introductionText';


// ----- Copy ----- //

const copy = [
  {
    heading: 'support the Guardian',
    copy: ['be part of our future', 'by helping to secure it'],
  },
  {
    heading: 'hold power to account',
    copy: ['by funding quality,', 'independent journalism'],
  },
];


// ----- Component ----- //

export default function Introduction() {
  return <IntroductionText messages={copy} />;
}
