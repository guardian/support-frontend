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
  ProductOptionLine
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

stories.add('Product Option 1', () => (
  <div style={{ width: '300px', margin: '0 20px' }}>
    <ProductOption>
      <ProductOptionTitle>Monday to Saturday</ProductOptionTitle>
      <ProductOptionContent>
        <ProductOptionPrice>£135.00</ProductOptionPrice>
        <ProductOptionCopy>for 1 year, then £150 a year</ProductOptionCopy>
        <ProductOptionLine />
        <ProductOptionOffer>Save £xx a month on retail price</ProductOptionOffer>
        <ProductOptionLine />
        <ProductOptionButton href="#" aria-label="Subscribe-button">Subscribe now</ProductOptionButton>
      </ProductOptionContent>
    </ProductOption>
  </div>
));

stories.add('Product Option 2', () => (
  <div style={{ width: '300px', margin: '0 20px' }}>
    <ProductOption>
      <ProductOptionTitle>Monday to Saturday</ProductOptionTitle>
      <ProductOptionContent>
        <ProductOptionOffer>Save £xx a month on</ProductOptionOffer>
        <ProductOptionPrice>£11.99</ProductOptionPrice>
        <ProductOptionCopy>a month for 12 months</ProductOptionCopy>
        <ProductOptionLine showLine={false} style={{ margin: '10px 0' }} />
        <ProductOptionButton href="#" aria-label="Subscribe-button">Subscribe now</ProductOptionButton>
      </ProductOptionContent>
    </ProductOption>
  </div>
));

stories.add('Product Option 3', () => (
  <div style={{ width: '300px', margin: '0 20px' }}>
    <ProductOption>
      <ProductOptionTitle>Monday to Saturday</ProductOptionTitle>
      <ProductOptionContent>
        <ProductOptionOffer>Save £xx a month on retail</ProductOptionOffer>
        <ProductOptionPrice>£11.99</ProductOptionPrice>
        <ProductOptionCopy bold>a month for 12 months</ProductOptionCopy>
        <ProductOptionLine />
        <ProductOptionCopy>Collect your papers from your local retailer</ProductOptionCopy>
        <ProductOptionLine showLine={false} style={{ margin: '5px 0' }} />
        <ProductOptionButton href="#" aria-label="Subscribe-button">Subscribe now</ProductOptionButton>
      </ProductOptionContent>
    </ProductOption>
  </div>
));

