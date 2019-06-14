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

// hocs
const withProductOptionsStyle = WrappedComponent => (props: PropTypes) => (
  <div className="product-option__button">
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
  <span className={cx({ 'product-option__copy': true, 'product-option__copy--bold': bold })}>{ children }</span>
);

export const ProductOptionOffer = ({ children }: { children: Node }) => (
  <div className="product-option__offer-container">
    <span className="product-option__offer">{ children }</span>
  </div>

);

export const ProductOptionButton = withProductOptionsStyle(AnchorButton);

// default component
const ProductOption = ({ onClick, href, children }: { children: Node }) => (
  <a href={href} onClick={onClick} className="product-option">{ children }</a>
);

ProductOptionCopy.defaultProps = {
  bold: false,
};

ProductOptionButton.defaultProps = {
  ...defaultProps,
};

export default ProductOption;
