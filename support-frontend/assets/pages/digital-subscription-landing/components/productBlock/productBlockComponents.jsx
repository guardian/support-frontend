/* eslint-disable react/no-unused-prop-types */
// @flow
// $FlowIgnore
import React, { useState, type Node } from 'react';
import cx from 'classnames';

import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { arrowSvg } from '../arrow';

export type DropdownPropTypes = {
  children: Node,
  showDropDown: boolean,
  product: string,
}

export const Dropdown = ({
  children, showDropDown, product,
}: DropdownPropTypes) => (
  <div
    id={`product-details-${product}`}
    className={cx('product-block__dropdown--hide', { 'product-block__dropdown--show': showDropDown })}
    aria-hidden={showDropDown ? 'false' : 'true'}
  >
    <span className="product-block__ul-handler">
      {children}
    </span>
  </div>
);

export type ButtonPropTypes = {
  showDropDown: boolean,
  handleClick: Function,
  product: 'daily' | 'app',
}

export const Button = ({
  showDropDown, handleClick, product,
}: ButtonPropTypes) => (
  <button
    aria-controls={`product-details-${product}`}
    aria-expanded={showDropDown ? 'true' : 'false'}
    onClick={handleClick}
    className={cx('product-block__button--hide', { 'product-block__button--show': showDropDown })}
  >
    <span className="product-block__button__text">
      <div className={showDropDown ? 'product-block__arrow--up' : 'product-block__arrow--down'}>{arrowSvg}</div>
      <span className="product-block__button__text--bold">
        {showDropDown ? 'Less detail' : 'More detail'}
      </span>
    </span>
  </button>
);

export type ProductCardPropTypes = {
  title: string,
  subtitle: string,
  image: Node,
  second: boolean,
}

export const ProductCard = ({
  title, subtitle, image, second = false,
}: ProductCardPropTypes) => (
  <section className="product-block__item">
    <h3 className="product-block__item__title">{title}</h3>
    <p className="product-block__item__subtitle">
      <span className={`product-block__item__subtitle--desktop${second ? '--second' : ''}`}>{subtitle}</span>
    </p>
    <span className={`product-block__item__image${second ? '--second' : '--first-row'}`}>{image}</span>
  </section>
);

ProductCard.defaultProps = {
  shortSubTitle: '',
};

type DigitalSubProduct = 'Daily' | 'App';

function trackClickAction(product: DigitalSubProduct, isOpen: boolean) {
  console.log('Is open?', isOpen);
  const clickAction = isOpen ? 'open' : 'close';
  sendTrackingEventsOnClick({
    id: `digital-subscriptions-landing-page--accordion--${product}--${clickAction}`,
    componentType: 'ACQUISITIONS_OTHER',
  })();
}

type ProductBlockSectionProps = {|
  product: DigitalSubProduct;
  render: (showDropDown: boolean) => Node;
|}

export const ProductBlockSection = ({ product, render }: ProductBlockSectionProps) => {
  const [showDropDown, setShowDropDownDaily] = useState<boolean>(false);

  function handleClick() {
    setShowDropDownDaily(!showDropDown);
    // setting state is async, so we reuse the reversed boolean here
    trackClickAction(product, !showDropDown);
  }

  return (
    <>
      {render(showDropDown)}
      <Button
        showDropDown={showDropDown}
        handleClick={handleClick}
        product={product.toLowerCase()}
      />
    </>
  );
};
