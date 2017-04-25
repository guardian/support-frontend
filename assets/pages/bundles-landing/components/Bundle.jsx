// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import InfoText from 'components/infoText/infoText';
import CtaLink from 'components/ctaLink/ctaLink';

import type { Children } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  subheading: string,
  infoText: string,
  ctaText: string,
  ctaLink: string,
  modifierClass: string,
  children?: Children,
};


// ----- Component ----- //

function Bundle(props: PropTypes) {

  let className = 'bundles__bundle';

  if (props.modifierClass) {
    className = `${className} bundles__bundle--${props.modifierClass}`;
  }

  return (
    <div className={className}>
      <DoubleHeading
        heading={props.heading}
        subheading={props.subheading}
      />
      {props.children}
      {props.infoText ? <InfoText text={props.infoText} /> : ''}
      <CtaLink text={props.ctaText} url={props.ctaLink} />
    </div>
  );

}


// ----- Proptypes ----- //

Bundle.defaultProps = {
  subheading: '',
  infoText: '',
  modifierClass: '',
  children: null,
};


// ----- Exports ----- //

export default connect()(Bundle);
