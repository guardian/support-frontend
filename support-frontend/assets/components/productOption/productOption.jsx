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
}

type ProductOptionType = {
  children: Node,
  onClick: Function,
  href: string
}

type ProductOptionOfferType = {
  children: Node,
  hidden: boolean
}

// hocs
const withProductOptionsStyle = WrappedComponent => (props: WrappedProps) => (
  <div className="product-option__button">
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

export const ProductOptionOffer = ({ children, hidden }: ProductOptionOfferType) => (
  <div className={cx('product-option__offer-container', { 'product-option__sales-copy--hidden': hidden })}>
    <span className="product-option__offer">{ children }</span>
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
