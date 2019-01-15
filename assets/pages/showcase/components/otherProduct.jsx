// @flow

import React from 'react';
import Heading from 'components/heading/heading';
import AnchorButton from 'components/button/anchorButton';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

type PropTypes = {|
  title: string,
  description: string,
  destination: string,
  modifierClass: string,
|};

export default function OtherProduct(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('other-product', [props.modifierClass])}>
      <Heading size={3} className="product-title">{props.title}</Heading>
      <div>{props.description}</div>
      <AnchorButton
        aria-label={null}
        icon={<ArrowRightStraight />}
        href={props.destination}
      >
        Find out more
      </AnchorButton>
    </div>
  );
}

OtherProduct.defaultProps = {
  modifierClass: '',
};
