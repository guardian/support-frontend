// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import FeatureList from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';
import GridImage from 'components/gridImage/gridImage';

import { classNameWithModifiers } from 'helpers/utilities';

import type { HeadingSize } from 'components/heading/heading';
import type { ListItem } from 'components/featureList/featureList';
import type { GridImg } from 'components/gridImage/gridImage';
import { type Option } from 'helpers/types/option';

import 'components/threeSubscriptions/threeSubscriptions.scss';
import Highlights from 'components/highlights/highlights';


// ----- Props ----- //

type BundleCta = {
  text: string,
  url: string,
  accessibilityHint: string,
  modifierClasses: Array<?string>,
  onClick?: ?Function,
};

type Benefits = {
  list: true,
  benefits: ListItem[],
} | {
  list: false,
  copy: Node,
};

type PropTypes = {|
  modifierClass?: string,
  heading: string,
  subheading: Node,
  benefits: Benefits,
  gridImage: GridImg,
  headingSize: HeadingSize,
  ctas: BundleCta[],
  highlightSavings?: Option<string>,
|};


// ----- Component ----- //

export default function SubscriptionBundle(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('component-subscription-bundle', [props.modifierClass])}>
      {
        props.ctas.length === 1 ?
          <a href={props.ctas[0].url} onClick={props.ctas[0].onClick}><GridImage {...props.gridImage} /></a>
        :
          <GridImage {...props.gridImage} />
      }
      <div className="component-subscription-bundle__content">
        <DoubleHeading
          heading={props.heading}
          subheading={props.subheading}
          headingSize={props.headingSize}
        />
        <p className="component-subscription-bundle--space-below">
          <span className="component-subscription-bundle--yellow">{props.highlightSavings}</span>
        </p>
        {props.benefits.list ?
          <FeatureList listItems={props.benefits.benefits} modifierClass={props.modifierClass} /> :
          <p className="component-subscription-bundle__description">{props.benefits.copy}</p>
        }
        {props.ctas.map(cta => <CtaLink {...cta} />)}
      </div>
    </div>
  );

}


// ----- Default Props ----- //

SubscriptionBundle.defaultProps = {
  modifierClass: '',
  highlightSavings: null,
};
