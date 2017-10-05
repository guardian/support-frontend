// @flow

// ----- Imports ----- //

import React from 'react';
import IntroductionText from 'components/introductionText/introductionText';


// ----- Copy ----- //

const copy = [
  {
    heading: 'help us deliver the',
    copy: ['independent journalism', 'the world needs'],
  },
  {
    heading: 'support the Guardian',
    copy: ['contribute or subscribe'],
  },
];


// ----- Component ----- //

export default function Introduction() {
  return <IntroductionText messages={copy} />;
}
