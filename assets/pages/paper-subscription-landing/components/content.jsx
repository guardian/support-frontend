// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';


import SvgInfo from 'components/svgs/information';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { sansParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageTextBlockList from 'components/productPage/productPageTextBlock/productPageTextBlockList';

import { type State } from '../paperSubscriptionLandingPageReducer';
import Form from './form';


type PropTypes = {|
  selectedTab: number,
|};

// ----- Render ----- //

class Content extends Component<PropTypes> {

  componentDidUpdate({ selectedTab }) {
    if (selectedTab !== this.props.selectedTab && this.tabRef) {
      this.tabRef.focus();
    }
  }

  tabRef: ?HTMLDivElement;

  render() {
    const { selectedTab } = this.props;
    return selectedTab === 'collection' ? (<div tabIndex={-1} ref={(d) => { this.tabRef = d; }}>hiii</div>) : (
      <div tabIndex={-1} ref={(d) => { this.tabRef = d; }}>
        <ProductPageContentBlock>
          <ProductPageTextBlock title="How do vouchers work?">
            <ProductPageTextBlockList items={[
            `When you take out a voucher subscription, we’ll send you a book of vouchers.
               There’s one for each newspaper in the package you choose. So if you choose a
               Sixday package, for example, you’ll receive six vouchers for each week,
               delivered every quarter.
            `,
            `You can exchange these vouchers for that day’s newspaper at retailers
              across the UK. That includes most independent newsagents, a range of petrol
              stations, and most supermarkets, including Tesco, Sainsbury’s and
              Waitrose & Partners.
            `,
            `Your newsagent won’t lose out; we’ll pay them the same amount that
              they receive if you pay cash for your paper.
            `,
            'You’ll receive your vouchers within 14 days of subscribing.',
            `You can pause your subscription for up to four weeks a year. So if
              you’re heading away, you won’t have to pay for the papers you’ll miss.
            `]}
            />
          </ProductPageTextBlock>
        </ProductPageContentBlock>
        <ProductPageContentBlock type="feature">
          <ProductPageTextBlock title="Subscribe to Guardian Paper today">
            <p>Now pick your perfect voucher subscription package</p>
          </ProductPageTextBlock>
          <Form />
        </ProductPageContentBlock>
        <ProductPageContentBlock type="feature" >
          <ProductPageTextBlock title="FAQ and help" icon={<SvgInfo />}>
            <p className={sansParagraphClassName}>Lorem <a href="#top">Ipsum</a>
            </p>
          </ProductPageTextBlock>
        </ProductPageContentBlock>
      </div>);
  }
}


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: state.page.tabs.active,
});

// ----- Exports ----- //

export default connect(mapStateToProps)(Content);
