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
export const ProductOptionLine = ({ showLine, style }: { showLine: boolean, style?: { [string]: string } }) =>
  (<span style={style} className={cx({ 'product-option__line': true, 'product-option__line--show': showLine })} />);

export const ProductOptionContent = ({ children }: { children: Node}) => (
  <div className="product-option__content">{ children }</div>
);

export const ProductOptionTitle = (props: Props) => (
  <div className="product-option__title">{ props.children }</div>
);

export const ProductOptionPrice = ({ children }: { children: Node}) => (
  <div className="product-option__price">{ children }</div>
);

export const ProductOptionCopy = ({ children, bold }: { children: Node, bold?: boolean }) => (
  <div className={cx({ 'product-option__copy': true, 'product-option__copy--bold': bold })}>{ children }</div>
);

export const ProductOptionOffer = ({ children }: { children: Node }) => (
  <div className="product-option__offer">{ children }</div>
);

export const ProductOptionButton = withProductOptionsStyle(AnchorButton);

// default component
const ProductOption = ({ children }: { children: Node }) => (
  <div className="product-option">{ children }</div>
);

ProductOptionLine.defaultProps = {
  showLine: true,
  style: {},
};

ProductOptionCopy.defaultProps = {
  bold: false,
};

ProductOptionButton.defaultProps = {
  ...defaultProps,
};

export default ProductOption;
