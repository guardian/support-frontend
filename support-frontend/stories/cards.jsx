// @flow
import React from 'react';
import ProductPagePlanFormLabel from 'components/productPage/productPagePlanForm/productPagePlanFormLabel';
import ProductPagePlanFormPrice from 'components/productPage/productPagePlanForm/productPagePlanFormPrice';

// components
import ProductOption, { Content, Title, Price, Copy, Offer, Button, Line } from 'components/productOption/productOption';

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
        footer={<ProductPagePlanFormPrice title="should this be a string?" copy="this is a saving" />}
      >
          You pay: £20.76 a month for 12 months
      </ProductPagePlanFormLabel>
    </div>
  </div>
));

stories.add('Product Option 1', () => (
  <div style={{ width: '300px', margin: '0 20px' }}>
    <ProductOption>
      <Title>Monday to Saturday</Title>
      <Content>
        <Price>£135.00</Price>
        <Copy>for 1 year, then £150 a year</Copy>
        <Line />
        <Offer>Save £xx a month on retail price</Offer>
        <Line />
        <Button href="#" aria-label="Subscribe-button">Subscribe now</Button>
      </Content>
    </ProductOption>
  </div>
));

stories.add('Product Option 2', () => (
  <div style={{ width: '300px', margin: '0 20px' }}>
    <ProductOption>
      <Title>Monday to Saturday</Title>
      <Content>
        <Offer>Save £xx a month on</Offer>
        <Price>£11.99</Price>
        <Copy>a month for 12 months</Copy>
        <Line showLine={false} style={{ margin: '10px 0' }} />
        <Button href="#" aria-label="Subscribe-button">Subscribe now</Button>
      </Content>
    </ProductOption>
  </div>
));

stories.add('Product Option 3', () => (
  <div style={{ width: '300px', margin: '0 20px' }}>
    <ProductOption>
      <Title>Monday to Saturday</Title>
      <Content>
        <Offer>Save £xx a month on retail</Offer>
        <Price>£11.99</Price>
        <Copy bold>a month for 12 months</Copy>
        <Line />
        <Copy>Collect your papers from your local retailer</Copy>
        <Line showLine={false} style={{ margin: '5px 0' }} />
        <Button href="#" aria-label="Subscribe-button">Subscribe now</Button>
      </Content>
    </ProductOption>
  </div>
));

