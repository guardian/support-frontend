// @flow

import React from 'react';
import Heading from 'components/heading/heading';
import UiButton from 'components/ui/uiButton/uiButton';
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
      <UiButton
        icon={<ArrowRightStraight />}
        href={props.destination}
      >
        Find out more
      </UiButton>
    </div>
  );
}

OtherProduct.defaultProps = {
  modifierClass: '',
};
