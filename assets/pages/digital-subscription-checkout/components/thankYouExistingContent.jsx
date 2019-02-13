// @flow

// ----- Imports ----- //

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import AppsSection from './thankYou/appsSection';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};

// ----- Component ----- //

function ThankYouExistingContent({ countryGroupId }: PropTypes) {

  return (
    <div>
      <ProductPageContentBlock>
        <ProductPageTextBlock>
          <LargeParagraph>
            You have access to the following products
          </LargeParagraph>
        </ProductPageTextBlock>
        <AppsSection countryGroupId={countryGroupId} />
      </ProductPageContentBlock>
    </div>
  );

}

// ----- Export ----- //

export default ThankYouExistingContent;
