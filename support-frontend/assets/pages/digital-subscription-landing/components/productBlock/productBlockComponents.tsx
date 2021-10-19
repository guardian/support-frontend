/* eslint-disable react/no-unused-prop-types */
// @ts-ignore
import type { Node } from "react";
import React, { useState } from "react";
import cx from "classnames";
import { sendTrackingEventsOnClick } from "helpers/productPrice/subscriptions";
import { arrowSvg } from "../arrow";
type DigitalSubProduct = "Daily" | "App";
export type DropdownPropTypes = {
  children: Node;
  showDropDown: boolean;
  product: DigitalSubProduct;
};
export const Dropdown = ({
  children,
  showDropDown,
  product
}: DropdownPropTypes) => <div id={`product-details-${product.toLowerCase()}`} className={cx('product-block__dropdown--hide', {
  'product-block__dropdown--show': showDropDown
})} aria-hidden={showDropDown ? 'false' : 'true'}>
    <span className="product-block__ul-handler">
      {children}
    </span>
  </div>;
export type DropdownButtonPropTypes = {
  showDropDown: boolean;
  handleClick: (...args: Array<any>) => any;
  product: DigitalSubProduct;
};
export const DropdownButton = ({
  showDropDown,
  handleClick,
  product
}: DropdownButtonPropTypes) => <button aria-controls={`product-details-${product.toLowerCase()}`} aria-expanded={showDropDown ? 'true' : 'false'} onClick={handleClick} className={cx('product-block__button--hide', {
  'product-block__button--show': showDropDown
})}>
    <span className="product-block__button__text">
      <div className={showDropDown ? 'product-block__arrow--up' : 'product-block__arrow--down'}>{arrowSvg}</div>
      <span className="product-block__button__text--bold">
        {showDropDown ? 'Less detail' : 'More detail'}
      </span>
    </span>
  </button>;
export type ProductCardPropTypes = {
  title: string;
  subtitle: string;
  image: Node;
  second: boolean;
};
export const ProductCard = ({
  title,
  subtitle,
  image,
  second = false
}: ProductCardPropTypes) => <section className="product-block__item">
    <h3 className="product-block__item__title">{title}</h3>
    <p className="product-block__item__subtitle">
      <span className={`product-block__item__subtitle--desktop${second ? '--second' : ''}`}>{subtitle}</span>
    </p>
    <span className={`product-block__item__image${second ? '--second' : '--first-row'}`}>{image}</span>
  </section>;
ProductCard.defaultProps = {
  shortSubTitle: ''
};

function trackClickAction(product: DigitalSubProduct, isOpen: boolean) {
  const clickAction = isOpen ? 'open' : 'close';
  sendTrackingEventsOnClick({
    id: `digital-subscriptions-landing-page--accordion--${product}--${clickAction}`,
    componentType: 'ACQUISITIONS_OTHER'
  })();
}

type ProductBlockSectionProps = {
  product: DigitalSubProduct;
  render: (showDropDown: boolean) => Node;
};
export const ProductBlockSection = ({
  product,
  render
}: ProductBlockSectionProps) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  function handleClick() {
    setShowDropDown(!showDropDown);
    // setting state is async, so we reuse the reversed boolean here
    trackClickAction(product, !showDropDown);
  }

  return <>
      {render(showDropDown)}
      <DropdownButton showDropDown={showDropDown} handleClick={handleClick} product={product} />
    </>;
};