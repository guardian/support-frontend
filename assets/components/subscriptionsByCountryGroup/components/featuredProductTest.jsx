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
  paperSection: (ComponentAbTest | null) => React$Element<typeof PaperSection>,
  digitalSection: (ComponentAbTest | null) => React$Element<typeof DigitalSection>,
  countryGroupId: CountryGroupId,
  digitalPackUrl: string,
};


// ----- Functions ----- //

function getTestProperties(variant: string): ComponentAbTest {
  return { name: 'featuredProduct', variant };
}


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
            abTest={getTestProperties('featured')}
          />
          {props.digitalSection(getTestProperties('featured'))}
          {props.paperSection(getTestProperties('featured'))}
        </div>
      );

    case 'featuredShort':
      return (
        <div className={className}>
          <FeaturedDigitalPack
            headingSize={3}
            countryGroupId={props.countryGroupId}
            url={props.digitalPackUrl}
            abTest={getTestProperties('featuredShort')}
          />
          {props.paperSection(getTestProperties('featuredShort'))}
        </div>
      );

    case 'control':
      return (
        <div className={className}>
          {props.digitalSection(getTestProperties('control'))}
          {props.paperSection(getTestProperties('control'))}
        </div>
      );

    default:
      return (
        <div className={className}>
          <FeaturedDigitalPack
            headingSize={3}
            countryGroupId={props.countryGroupId}
            url={props.digitalPackUrl}
          />
          {props.digitalSection(null)}
          {props.paperSection(null)}
        </div>
      );

  }

}


// ----- Exports ----- //

export default FeaturedProductTest;
