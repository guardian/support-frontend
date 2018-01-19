// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import FeatureList from 'components/featureList/featureList';
import CtaCircle from 'components/ctaCircle/ctaCircle';

import { generateClassName } from 'helpers/utilities';

import type { ListItem } from 'components/featureList/featureList';


// ----- Props ----- //

type PropTypes = {
  modifierClass?: string,
  heading: string,
  subheading: string,
  benefits: ListItem[],
  ctaText: string,
  ctaLink: string,
};


// ----- Component ----- //

export default function SubscriptionBundle(props: PropTypes) {

  return (
    <div className={generateClassName('component-subscription-bundle', props.modifierClass)}>
      <DoubleHeading
        heading={props.heading}
        subheading={props.subheading}
      />
      <FeatureList listItems={props.benefits} modifierClass={props.modifierClass} />
      <CtaCircle text={props.ctaText} url={props.ctaLink} />
    </div>
  );

}


// ----- Default Props ----- //

SubscriptionBundle.defaultProps = {
  modifierClass: '',
};
