// @flow

// ----- Import ----- //

import React from 'react';

import { getQueryParameter } from 'helpers/url';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type ComponentAbTest } from 'helpers/subscriptions';

import FeaturedDigitalPack from 'components/featuredDigitalPack/featuredDigitalPack';

import DigitalSection from './digitalSection';
import PaperSection from './paperSection';


// ----- Types ----- //

type PropTypes = {
  paperSection: (ComponentAbTest | void) => React$Element<typeof PaperSection>,
  digitalSection: (ComponentAbTest | void) => React$Element<typeof DigitalSection>,
  countryGroupId: CountryGroupId,
  digitalPackUrl: string,
};


// ----- Component ----- //

function FeaturedProductTest(props: PropTypes) {

  const testParam = getQueryParameter('featuredProduct');
  const className = 'component-featured-product-test';

  switch (testParam) {

    case 'featured':
      return (
        <div className={className}>
          <FeaturedDigitalPack
            headingSize={3}
            countryGroupId={props.countryGroupId}
            url={props.digitalPackUrl}
          />
          {props.digitalSection({ name: 'featuredProduct', variant: 'featured' })}
          {props.paperSection({ name: 'featuredProduct', variant: 'featured' })}
        </div>
      );

    case 'featuredShort':
      return (
        <div className={className}>
          <FeaturedDigitalPack
            headingSize={3}
            countryGroupId={props.countryGroupId}
            url={props.digitalPackUrl}
          />
          {props.paperSection({ name: 'featuredProduct', variant: 'featuredShort' })}
        </div>
      );

    case 'control':
      return (
        <div className={className}>
          {props.digitalSection({ name: 'featuredProduct', variant: 'control' })}
          {props.paperSection({ name: 'featuredProduct', variant: 'control' })}
        </div>
      );

    default:
      return (
        <div className={className}>
          {props.digitalSection()}
          {props.paperSection()}
        </div>
      );

  }

}


// ----- Exports ----- //

export default FeaturedProductTest;
