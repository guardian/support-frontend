// @flow

// ----- Imports ----- //

import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type Feature = {|
  title: string,
  copy?: ?string
|}

type PropTypes = {|
  features: Feature[],
  headingSize: HeadingSize,
|};


// ----- Render ----- //

const ProductPageFeatures = ({ features, headingSize }: PropTypes) => (
  <ul className="component-product-page-features">
    {features.map(({ title, copy }) => (
      <li className="component-product-page-features__item">
        <Heading className="component-product-page-features__title" size={headingSize}>{title}</Heading>
        {copy && <p className="component-product-page-features__copy" >{copy}</p>}
      </li>
    ))}
  </ul>
);

ProductPageFeatures.defaultProps = {
  headingSize: 3,
};

export default ProductPageFeatures;
