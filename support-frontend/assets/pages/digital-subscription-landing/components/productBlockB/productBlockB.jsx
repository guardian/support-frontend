// @flow

import React, { type Node } from 'react';

// components
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';
import Text from 'components/text/text';

// styles
import './productBlockB.scss';

type ChildProps = {
  children: Node
};

const ProductBlockHeader = ({ children }: ChildProps) => (
  <div className="product-block__header">
    { children }
  </div>
);

const ProductBlockSubHeader = ({ children }: ChildProps) => (
  <div className="product-block__sub-header">
    { children }
  </div>
);

const ProductBlockContent = ({ children }: ChildProps) => (
  <div className="product-block__content">
    { children }
  </div>
);

const ProductBlockLeftContent = ({ children }: ChildProps) => (
  <div className="product-block__left-content">
    { children }
  </div>
);

const ProductBlockRightContent = ({ children }: ChildProps) => (
  <div
    id="product-block__right-content"
    className="product-block__right-content"
  >
    { children }
  </div>
);

const ProductBlockFeature = ({ children }: ChildProps) => (
  <div className="product-block__feature">
    { children }
  </div>
);

function ProductBlockB() {
  return (
    <div className="product-block">
      <LeftMarginSection>
        <ProductBlockHeader>Daily Edition</ProductBlockHeader>


        <ProductBlockContent>
          <ProductBlockLeftContent>

            <ProductBlockSubHeader>
              <h1>Every issue of The Guardian and Observer UK newspapers, designed for your iPad and available offline</h1>
            </ProductBlockSubHeader>


            <ProductBlockFeature>
              <h1 className="product-block__feature-title">Read on the go</h1>
              <Text>Your complete daily newspaper, designed for iPad and available offline</Text>
            </ProductBlockFeature>

            <ProductBlockFeature>
              <h1 className="product-block__feature-title">Get every supplement</h1>
              <Text>Including Weekend, Feast and Observer Food Monthly</Text>
            </ProductBlockFeature>

            <ProductBlockFeature>
              <h1 className="product-block__feature-title">Never wait for the news</h1>
              <Text>Downloads automatically at 4am every day, so it&apos;s there when you wake up</Text>
            </ProductBlockFeature>

            <ProductBlockFeature>
              <h1 className="product-block__feature-title">Enjoy our journalism at your own pace</h1>
              <Text>Access to your own 30-day archive</Text>
            </ProductBlockFeature>

          </ProductBlockLeftContent>

          <ProductBlockRightContent>
            <GridImage
              gridId="editionsProductBlock"
              srcSizes={[1000, 500, 140]}
              sizes="(min-width: 480px) 100%, (max-width: 660px) 100%, 100%"
              imgType="png"
            />
          </ProductBlockRightContent>

        </ProductBlockContent>
      </LeftMarginSection>
    </div>
  );
}

export default ProductBlockB;
