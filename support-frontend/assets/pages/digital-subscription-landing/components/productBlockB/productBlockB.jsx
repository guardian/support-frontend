// @flow
import React, { type Node } from 'react';

// components
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';
import Text from 'components/text/text';
import UnorderedList from 'components/list/unorderedList';

// styles
import './productBlockB.scss';

type ChildProps = {
  children: Node
};

const ProductBlockHeader = ({ children }: ChildProps) => (
  <h1 className="product-block__header">
    { children }
  </h1>
);

const ProductBlockGreyLines = () => (
  <div className="product-block__grey-line-container">
    <span className="product-block__grey-line" />
    <span className="product-block__grey-line" />
    <span className="product-block__grey-line" />
    <span className="product-block__grey-line" />
  </div>
);

const ProductBlockSubTitle = ({ children }: ChildProps) => (
  <h2 className="product-block__sub-title">
    { children }
  </h2>
);

const ProductBlockSubTitleText = ({ children }: ChildProps) => (
  <div className="product-block__sub-title-text-container">
    <p className="product-block__sub-title-text">
      { children }
    </p>
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

function ProductBlockB() {
  return (
    <div className="product-block">
      <LeftMarginSection>
        <ProductBlockHeader>The Digital Pack Subscription</ProductBlockHeader>
        <ProductBlockGreyLines />

        <ProductBlockSubTitle>App premium</ProductBlockSubTitle>

        <ProductBlockSubTitleText>
          Your enhanced experience of The Guardian for mobile and tablet, with exclusive features and ad-free reading
        </ProductBlockSubTitleText>

        <ProductBlockContent>

          <ProductBlockRightContent>
            <GridImage
              gridId="AppPremiumTier"
              srcSizes={[818, 500, 140]}
              sizes="(min-width: 480px) 100%, (max-width: 660px) 100%, 100%"
              imgType="png"
            />
          </ProductBlockRightContent>

          <ProductBlockLeftContent>
            <Text>
              <UnorderedList items={[(
                <div>
                  <h1 className="product-block__feature-title">Live</h1>
                  <p>Catch up on every news story as it breaks</p>
                </div>
              ), (
                <div>
                  <h1 className="product-block__feature-title">Discover</h1>
                  <Text>Explore a beautifully curated feed of features, reviews and opinion</Text>
                </div>
              ), (
                <div>
                  <h1 className="product-block__feature-title">Enhanced offline reading</h1>
                  <Text>Quality journalism on your schedule - download the day&apos;s news before you travel</Text>
                </div>
              ), (
                <div>
                  <h1 className="product-block__feature-title">Complete the daily crossword</h1>
                  <Text>Get our daily crossword wherever you are</Text>
                </div>
              )]}
              />
            </Text>
          </ProductBlockLeftContent>

        </ProductBlockContent>

        {/* Second Section */}

        <ProductBlockContent>
          <ProductBlockSubTitle>iPad daily edition</ProductBlockSubTitle>
          <ProductBlockSubTitleText>
            Every issue of The Guardian and Observer UK newspapers, designed for your iPad and available offline
          </ProductBlockSubTitleText>

          <ProductBlockRightContent>
            <GridImage
              gridId="editionsProductBlock"
              srcSizes={[1000, 500, 140]}
              sizes="(min-width: 480px) 100%, (max-width: 660px) 100%, 100%"
              imgType="png"
            />
          </ProductBlockRightContent>

          <ProductBlockLeftContent>
            <Text>
              <UnorderedList items={[(
                <div>
                  <h1 className="product-block__feature-title">Live</h1>
                  <Text>Catch up on every news story as it breaks</Text>
                </div>
              ), (
                <div>
                  <h1 className="product-block__feature-title">Discover</h1>
                  <Text>Explore a beautifully curated feed of features, reviews and opinion</Text>
                </div>
              ), (
                <div>
                  <h1 className="product-block__feature-title">Enhanced offline reading</h1>
                  <Text>Quality journalism on your schedule - download the day&apos;s news before you travel</Text>
                </div>
              ), (
                <div>
                  <h1 className="product-block__feature-title">Complete the daily crossword</h1>
                  <Text>Get our daily crossword wherever you are</Text>
                </div>
              )]}
              />
            </Text>
          </ProductBlockLeftContent>

        </ProductBlockContent>
      </LeftMarginSection>

    </div>
  );
}

export default ProductBlockB;
