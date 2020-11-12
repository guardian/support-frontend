// @flow

import React from 'react';
import { List } from 'components/productPage/productPageList/productPageList';

import BenefitsContainer from './BenefitsContainer';
import BenefitsHeading from './BenefitsHeading';


function GiftBenefits() {
  return (
    <BenefitsContainer
      sections={[
        {
          id: 'gift-benefits-them',
          content: (
            <>
              <BenefitsHeading text="What they'll get" />
              <List items={[
                { explainer: 'The Guardian Weekly delivered, wherever they are in the world' },
                { explainer: 'The Guardian\'s global journalism to keep them informed' },
                { explainer: 'The very best of The Guardian\'s puzzles' },
              ]}
              />
            </>
          ),
        },
        {
          id: 'gift-benefits-you',
          content: (
            <>
              <BenefitsHeading text="What you'll get" />
              <List items={[
                { explainer: 'Your gift supports The Guardian\'s independent journalism' },
                { explainer: 'Access to the magazine\'s digital archive' },
                { explainer: '35% off the cover price' },
              ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

export default GiftBenefits;
