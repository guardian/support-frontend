// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import DoubleHeading from 'components/doubleHeading/doubleHeading';
import InfoText from 'components/infoText/infoText';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Component ----- //

function Bundle(props) {

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

Bundle.propTypes = {
  heading: React.PropTypes.string.isRequired,
  subheading: React.PropTypes.string,
  infoText: React.PropTypes.string,
  ctaText: React.PropTypes.string.isRequired,
  ctaLink: React.PropTypes.string.isRequired,
  modifierClass: React.PropTypes.string,
  children: React.PropTypes.element,
};


// ----- Exports ----- //

export default connect()(Bundle);
