// @flow

// ----- Import ----- //

import React from 'react';

import { getQueryParameter } from 'helpers/url';

import DigitalSection from './digitalSection';
import PaperSection from './paperSection';


// ----- Types ----- //

type PropTypes = {
  paperSection: React$Element<typeof PaperSection>,
  digitalSection: React$Element<typeof DigitalSection>,
};


// ----- Component ----- //

function FeaturedProductTest(props: PropTypes) {

  const testParam = getQueryParameter('featuredProduct');
  const className = 'component-featured-product-test';

  switch (testParam) {

    case 'featured':
      return (
        <div className={className}>
          <h1>Featured</h1>
          {props.digitalSection}
          {props.paperSection}
        </div>
      );

    case 'featuredShort':
      return (
        <div className={className}>
          <h1>Featured</h1>
          {props.paperSection}
        </div>
      );

    case 'control':
    default:
      return (
        <div className={className}>
          {props.digitalSection}
          {props.paperSection}
        </div>
      );

  }

}


// ----- Exports ----- //

export default FeaturedProductTest;
