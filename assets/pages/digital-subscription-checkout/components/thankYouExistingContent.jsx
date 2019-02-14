// @flow

// ----- Imports ----- //

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import Text, { LargeParagraph } from 'components/text/text';
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
        <Text>
          <LargeParagraph>
            You have access to the following products:
          </LargeParagraph>
        </Text>
        <AppsSection countryGroupId={countryGroupId} />
      </ProductPageContentBlock>
    </div>
  );

}

// ----- Export ----- //

export default ThankYouExistingContent;
