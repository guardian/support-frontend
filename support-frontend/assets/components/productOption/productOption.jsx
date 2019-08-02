// @flow
import React, { type Node } from 'react';
import cx from 'classnames';

// components
import AnchorButton, { type PropTypes } from 'components/button/anchorButton';
import { defaultProps } from 'components/button/_sharedButton';

// styles
import './productOption.scss';

type Props = {
  children: Node,
};
type WrappedProps = {
  ...PropTypes,
  salesCopy: Node,
  dailyEditionsVariant: boolean
}

type ProductOptionType = {
  children: Node,
  onClick: Function,
  href: string
}

type ProductOptionOfferType = {
  dailyEditionsVariant: boolean,
  children: Node,
  hidden: boolean
}

// hocs
const withProductOptionsStyle = WrappedComponent => (props: WrappedProps) => (
  <div className={cx('product-option__button', { 'product-option__button--variantB': props.dailyEditionsVariant })}>
    <div className="product-option__sales-copy">{props.salesCopy}</div>
    <WrappedComponent {...props} />
  </div>
);

// presentation components
export const ProductOptionContent = ({ children }: { children: Node}) => (
  <div className="product-option__content">{ children }</div>
);

export const ProductOptionTitle = (props: Props) => (
  <div className="product-option__title">{ props.children }</div>
);

export const ProductOptionPrice = ({ children }: { children: Node}) => (
  <p className="product-option__price">{ children }</p>
);

export const ProductOptionCopy = ({ children, bold }: { children: Node, bold?: boolean }) => (
  <span className={cx('product-option__copy', { 'product-option__copy--bold': bold })}>{ children }</span>
);

export const ProductOptionOffer = ({ dailyEditionsVariant, children, hidden }: ProductOptionOfferType) => (
  <div className={cx('product-option__offer-container', { 'product-option__sales-copy--hidden': hidden })}>
    <span className={cx('product-option__offer', { 'product-option__offer--variantB': dailyEditionsVariant })}>{ children }</span>
  </div>

);

export const ProductOptionButton = withProductOptionsStyle(AnchorButton);

const ProductOption = ({ onClick, href, children }: ProductOptionType) => (
  <a href={href} onClick={onClick} className="product-option">{ children }</a>
);

// default props
ProductOptionCopy.defaultProps = {
  bold: false,
};

ProductOptionButton.defaultProps = {
  ...defaultProps,
};

export default ProductOption;
