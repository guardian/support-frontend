// @flow

// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import FeatureList from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';
import GridImage from 'components/gridImage/gridImage';

import { classNameWithOptModifier } from 'helpers/utilities';

import type { ListItem } from 'components/featureList/featureList';
import type { GridImg } from 'components/gridImage/gridImage';


// ----- Props ----- //

type PropTypes = {
  modifierClass?: string,
  heading: string,
  subheading: string,
  benefits: ListItem[],
  ctaText: string,
  ctaUrl: string,
  ctaId: string,
  ctaAccessibilityHint: string,
  gridImage: GridImg,
};


// ----- Component ----- //

export default function SubscriptionBundle(props: PropTypes) {

  return (
    <div className={classNameWithOptModifier('component-subscription-bundle', props.modifierClass)}>
      <GridImage {...props.gridImage} />
      <div className="component-subscription-bundle__content">
        <DoubleHeading
          heading={props.heading}
          subheading={props.subheading}
        />
        <FeatureList listItems={props.benefits} modifierClass={props.modifierClass} />
        <CtaLink
          text={props.ctaText}
          url={props.ctaUrl}
          ctaId={props.ctaId}
          accessibilityHint={props.ctaAccessibilityHint}
        />
      </div>
    </div>
  );

}


// ----- Default Props ----- //

SubscriptionBundle.defaultProps = {
  modifierClass: '',
};
