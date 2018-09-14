// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import FeatureList from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';
import GridImage from 'components/gridImage/gridImage';

import { classNameWithModifiers } from 'helpers/utilities';

import type { HeadingSize } from 'components/heading/heading';
import type { ListItem } from 'components/featureList/featureList';
import type { GridImg } from 'components/gridImage/gridImage';


// ----- Props ----- //

type BundleCta = {
  text: string,
  url: string,
  accessibilityHint: string,
  modifierClasses: Array<?string>,
  onClick?: ?Function,
};

type PropTypes = {
  modifierClass?: string,
  heading: string,
  subheading: string,
  benefits: ListItem[],
  gridImage: GridImg,
  headingSize: HeadingSize,
  ctas: BundleCta[],
};


// ----- Component ----- //

export default function SubscriptionBundle(props: PropTypes) {

  return (
    <div className={classNameWithModifiers('component-subscription-bundle', [props.modifierClass])}>
      <GridImage {...props.gridImage} />
      <div className="component-subscription-bundle__content">
        <DoubleHeading
          heading={props.heading}
          subheading={props.subheading}
          headingSize={props.headingSize}
        />
        <FeatureList listItems={props.benefits} modifierClass={props.modifierClass} />
        {props.ctas.map(cta => <CtaLink {...cta} />)}
      </div>
    </div>
  );

}


// ----- Default Props ----- //

SubscriptionBundle.defaultProps = {
  modifierClass: '',
};
