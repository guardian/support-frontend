// @flow
import React from 'react';
import ProductPagePlanFormLabel from 'components/productPage/productPagePlanForm/productPagePlanFormLabel';
import ProductPagePlanFormPrice from 'components/productPage/productPagePlanForm/productPagePlanFormPrice';

// components
import ProductOption, {
  ProductOptionContent,
  ProductOptionTitle,
  ProductOptionPrice,
  ProductOptionCopy,
  ProductOptionOffer,
  ProductOptionButton,
} from 'components/productOption/productOption';

// storybook
import { storiesOf } from '@storybook/react';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

const stories = storiesOf('Cards', module).addDecorator(withCenterAlignment);

const noOp = () => {};

stories.add('Old Product Option', () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '300px', margin: '0 20px' }}>
      <ProductPagePlanFormLabel
        title="Monday to Saturday"
        offer="Save £xx a month on retail price"
        key={1}
        href="http://localhost:productOptions"
        onClick={noOp}
        footer={<ProductPagePlanFormPrice title="You pay £24.86 a month" copy="Your saving is £2.94 per month" />}
      >
          You pay: £20.76 a month for 12 months
      </ProductPagePlanFormLabel>
    </div>
  </div>
));

stories.add('Product Option', () => (
  <div style={{ width: '230px', margin: '0 20px' }}>
    <ProductOption>
      <ProductOptionContent>
        <ProductOptionTitle>Monthly</ProductOptionTitle>
        <ProductOptionPrice>
          £11.99&nbsp;
          <ProductOptionCopy>/month</ProductOptionCopy>
        </ProductOptionPrice>
        <ProductOptionOffer hidden={false}>Save 22% a month on <br />&nbsp;retail price</ProductOptionOffer>
      </ProductOptionContent>
      <ProductOptionButton href="#" aria-label="Subscribe-button">Subscribe now</ProductOptionButton>
    </ProductOption>
  </div>
));
