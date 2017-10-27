// @flow

// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import GridImage from 'components/gridImage/gridImage';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  price: string,
  from: boolean,
  copy: string,
  ctaText: string,
  image: string,
};


// ----- Component ----- //

export default function SubscriptionBundle(props: PropTypes) {

  return (
    <div className="subscription-bundle">
      <GridImage
        gridId={props.image}
        srcSizes={[600]}
        sizes="600px"
        altText={`${props.heading} bundle`}
        imgType="png"
      />
      <h3 className="subscription-bundle__heading">{props.heading}</h3>
      <h4 className="subscription-bundle__price">
        {props.from ? 'from ' : ''}
        <span className="subscription-bundle__price-amount">£{props.price}</span>
        <span className="subscription-bundle__price-period"> /&nbsp;month</span>
      </h4>
      <p className="subscription-bundle__copy">{props.copy}</p>
      <CtaCircle text={props.ctaText} />
    </div>
  );

}
