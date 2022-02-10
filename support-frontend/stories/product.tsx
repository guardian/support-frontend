import React from "react";
import { storiesOf } from "@storybook/react";
import { text, withKnobs } from "@storybook/addon-knobs";
import { SvgInfo } from "@guardian/source-react-components";
import ProductOption from "components/product/productOption";
import ProductOptionSmall from "components/product/productOptionSmall";
import ProductInfoChip from "components/product/productInfoChip";
const stories = storiesOf('Product', module).addDecorator(withKnobs({
  escapeHTML: false
}));
stories.add('ProductOption', () => {
  const product = {
    title: text('Title', '6 for 6'),
    price: text('Price', '£6'),
    offerCopy: text('Offer copy', '£6 for the first 6 issues'),
    priceCopy: text('Price copy', 'then £37.50 per quarter'),
    href: '',
    buttonCopy: text('Button copy', 'Subscribe now'),
    onClick: () => {},
    onView: () => {},
    label: text('Label', 'Best deal')
  };
  return <div style={{
    width: '100%',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#041F4A'
  }}>
      <ProductOption {...product} />
    </div>;
});
stories.add('ProductOptionSmall', () => {
  const containerStyles = {
    width: '320px',
    padding: '20px',
    backgroundColor: '#04204B',
    color: 'white',
    marginRight: '20px'
  };
  const product1 = {
    offerCopy: text('Offer copy - first option', '50% off for 3 months'),
    priceCopy: text('Price copy - first option', 'You\'ll pay £5.99/month for 3 months, then £11.99 per month'),
    href: '',
    buttonCopy: text('Button copy - first option', 'Subscribe monthly for £5.99'),
    onClick: () => {},
    onView: () => {},
    billingPeriod: 'Monthly'
  };
  const product2 = {
    offerCopy: text('Offer copy - second option', 'Save 20% against monthly in the first year'),
    priceCopy: text('Price copy - second option', 'You\'ll pay £99 for 1 year, then £119 per year'),
    href: '',
    buttonCopy: text('Button copy - second option', 'Subscribe annually for £99'),
    onClick: () => {},
    onView: () => {},
    billingPeriod: 'Monthly'
  };
  return <div style={{
    display: 'flex'
  }}>
      <div style={containerStyles}>
        <ProductOptionSmall {...product1} />
      </div>

      <div style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      ...containerStyles
    }}>
        <ProductOptionSmall {...product1} />
        <ProductOptionSmall {...product2} />
      </div>
    </div>;
});
stories.add('ProductInfoChip', () => <div style={{
  width: '100%',
  padding: '16px',
  backgroundColor: '#04204B',
  color: '#ffffff'
}}>
    <ProductInfoChip icon={<SvgInfo />}>
      This can give some additional information about a product
    </ProductInfoChip>
    <ProductInfoChip>
      It can be used with or without an icon
    </ProductInfoChip>
  </div>);
