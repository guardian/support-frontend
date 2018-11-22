// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageContentBlockDivider from 'components/productPage/productPageContentBlock/productPageContentBlockDivider';
import ProductPageTextBlock, { sansParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageTextBlockList from 'components/productPage/productPageTextBlock/productPageTextBlockList';
import SvgInfo from 'components/svgs/information';
import { paperSubsUrl } from 'helpers/routes';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../paperSubscriptionLandingPageActions';

import Form from './form';

import './content.scss';

type PropTypes = {|
  selectedTab: number,
  setTabAction: typeof setTab
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
    const { selectedTab, setTabAction } = this.props;

    const faqs = (
      <ProductPageContentBlock type="feature" >
        <ProductPageTextBlock title="FAQ and help" icon={<SvgInfo />}>
          <p className={sansParagraphClassName}>
          If you’ve got any more questions, you might well find the answers in the <a href="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions">Subscriptions FAQs</a>.
           If you can’t find the answer to your question here, please call our customer services team on PHONE NUMBER.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    );

    const collectionPage = (
      <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(d) => { this.tabRef = d; }}>
        <ProductPageContentBlock>
          <ProductPageTextBlock title="How do vouchers work?">
            <ProductPageTextBlockList items={[
                'When you take out a voucher subscription, we’ll send you a book of vouchers. There’s one for each newspaper in the package you choose. So if you choose a Sixday package, for example, you’ll receive six vouchers for each week, delivered every quarter',
                'You can exchange these vouchers for that day’s newspaper at retailers across the UK. That includes most independent newsagents, a range of petrol stations, and most supermarkets',
                'Your newsagent won’t lose out; we’ll pay them the same amount that they’d receive if you paid cash for your paper',
                'You can pause your subscription for up to four weeks a year. So if you’re going away, you won’t have to pay for the papers that you miss.',
              ]}
            />
          </ProductPageTextBlock>
        </ProductPageContentBlock>
        <ProductPageContentBlock type="feature">
          <ProductPageTextBlock title="Now pick your perfect voucher subscription package" />
          <ProductPageContentBlockDivider />
          <ProductPageTextBlock>
            <p>When you take out a voucher subscription, we’ll send you a book of vouchers.
              There’s one for each newspaper in the package you choose. So if you choose a
              Sixday package, for example, you’ll receive six vouchers for each week,
              delivered every quarter
            </p>
          </ProductPageTextBlock>
          <Form />
        </ProductPageContentBlock>
        {faqs}
      </div>
    );

    const linkToVouchers = (
      <a
        href={paperSubsUrl('collection')}
        onClick={(ev) => {
        ev.preventDefault();
        setTabAction('collection');
      }}
      >
      subscribe using our voucher scheme
      </a>);

    const deliveryPage = (
      <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(d) => { this.tabRef = d; }}>
        <ProductPageContentBlock>
          <ProductPageTextBlock title="How does delivery work?">
            <ProductPageTextBlockList items={[
                  (
                    <span>
                    If you live in Greater London (within the M25),
                    you can use The Guardian’s home delivery service. Don’t
                    worry if you live outside this area - you can still {linkToVouchers}.
                    </span>
                  ),
                  'Your paper will arrive before 7am from Monday to Saturday and before 8.30am on Sunday',
                  'Your newspaper deliveries will begin as quickly as five days from you subscribing',
                  'Delivery to individual flats, or apartments within blocks, is unavailable as we require access to your post box to deliver your paper',
                  'You can pause your subscription for up to 36 days a year. So if you’re going away anywhere, you won’t have to pay for the papers that you miss',
                ]}
            />
          </ProductPageTextBlock>
        </ProductPageContentBlock>
        <ProductPageContentBlock type="feature">
          <ProductPageTextBlock title="Now pick your perfect delivery subscription package" />
          <ProductPageContentBlockDivider />
          <Form />
        </ProductPageContentBlock>
        {faqs}
      </div>
    );

    return selectedTab === 'collection' ? (collectionPage) :
      deliveryPage;
  }
}


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: state.page.tabs.active,
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Content);
