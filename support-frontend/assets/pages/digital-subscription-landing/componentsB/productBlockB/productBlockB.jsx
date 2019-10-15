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
    <div className="product-block product-block--margin">
      <LeftMarginSection>
        <ProductBlockHeader>The Digital Subscription</ProductBlockHeader>
        <ProductBlockGreyLines />

        <ProductBlockSubTitle>The Guardian Daily</ProductBlockSubTitle>

        <ProductBlockSubTitleText>
          Each day&apos;s edition, in one simple, elegant app
        </ProductBlockSubTitleText>

        <ProductBlockContent>

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
                  <strong className="product-block__feature-title">A new way to read</strong>
                  The newspaper, reimagined for mobile and tablet
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Published daily</strong>
                  Each edition available to read by 6am (GMT), 7 days a week
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Easy to navigate</strong>
                  Read the complete edition, or swipe to the sections you care about
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Multiple devices</strong>
                  Beautifully designed for your mobile or tablet on iOS and Android
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Read offline</strong>
                  Download and read whenever it suits you
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Ad-free</strong>
                  Enjoy our journalism uninterrupted, without adverts
                </div>
              )]}
              />
            </Text>
          </ProductBlockLeftContent>

        </ProductBlockContent>

        {/* Second Section */}

        <ProductBlockContent>
          <ProductBlockSubTitle>Premium access to The Guardian Live app</ProductBlockSubTitle>
          <ProductBlockSubTitleText>
            Live news, as it happens
          </ProductBlockSubTitleText>

          <ProductBlockRightContent>
            <GridImage
              gridId="AppPremiumTier"
              srcSizes={[1000, 500, 140]}
              sizes="(min-width: 480px) 100%, (max-width: 660px) 100%, 100%"
              imgType="png"
            />
          </ProductBlockRightContent>

          <ProductBlockLeftContent>
            <Text>
              <UnorderedList items={[(
                <div>
                  <strong className="product-block__feature-title">Live</strong>
                  Follow a live feed of breaking news and sport, as it happens
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Discover</strong>
                  Explore stories you might have missed, tailored to you
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Enhanced offline reading</strong>
                  Download the news whenever it suits you
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Daily crossword</strong>
                  Play the daily crossword wherever you are
                </div>
              ), (
                <div>
                  <strong className="product-block__feature-title">Ad-free</strong>
                  Enjoy our journalism uninterrupted, without adverts
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
