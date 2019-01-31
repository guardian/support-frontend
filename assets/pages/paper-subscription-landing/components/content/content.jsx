// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';

import ProductPageContentBlock, { Divider } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import UnorderedList from 'components/productPage/list/unorderedList';
import OrderedList from 'components/productPage/list/orderedList';
import GridImage from 'components/gridImage/gridImage';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { type State, type ActiveTabState } from '../../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../../paperSubscriptionLandingPageActions';

import { ContentHelpBlock, LinkTo, ContentForm } from './helpers';

import './content.scss';


// ----- Content ----- //

const ContentVoucherFaqBlock = () => (
  <ProductPageContentBlock
    border
    image={<GridImage
      gridId="paperVoucherFeature"
      srcSizes={[750, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
  }
  >
    <ProductPageTextBlock title="How to use our vouchers?">
      <OrderedList items={[
        'Pick your subscription package below',
        'We’ll send you a book of vouchers that contain one voucher per paper in your subscription',
        'Take your voucher to your retailer. Your vouchers will be accepted at retailers across the UK, including most independent newsagents',
      ]}
      />
    </ProductPageTextBlock>
    <Divider small />
    <ProductPageTextBlock title="Giving you peace of mind">
      <UnorderedList items={[
        'Your newsagent won’t lose out; we’ll pay them the same amount that they receive if you pay cash for your paper',
        'You can pause your subscription for up to four weeks a year. So if you’re heading away, you won’t have to pay for the papers you’ll miss',
      ]}
      />
    </ProductPageTextBlock>
  </ProductPageContentBlock>
);

const ContentDeliveryFaqBlock = ({ setTabAction }: {setTabAction: typeof setTab}) => (
  <ProductPageContentBlock
    border
    image={<GridImage
      gridId="paperDeliveryFeature"
      srcSizes={[920, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
    }
  >
    <ProductPageTextBlock title="How home delivery works">
      <p>
          If you live in Greater London (within the M25), you
          can use The Guardian’s home delivery service. Don’t
          worry if you live outside this area you can
          still <LinkTo tab="collection" setTabAction={setTabAction} >subscribe using our voucher scheme</LinkTo>.
      </p>
      <OrderedList items={[
        'Select your subscription below and checkout',
        'Your subscribing deliveries will begin as quickly as five days from you subscribing',
        ]}
      />
    </ProductPageTextBlock>
    <Divider small />
    <ProductPageTextBlock title="Giving you peace of mind">
      <UnorderedList items={[
        'Your paper will arrive before 7am from Monday to Saturday and before 8.30am on Sunday',
        'We can’t delivery to individual flats, or apartments within blocks because we need access to your post box to deliver your paper',
        'You can pause your subscription for up to 36 days a year. So if you’re going away anywhere, you won’t have to pay for the papers that you miss',
        ]}
      />
    </ProductPageTextBlock>
  </ProductPageContentBlock>

);

function trackedLink(href: string, text: string, onClick: Function) {
  return <a href={href} onClick={onClick}>{text}</a>;
}


// ----- Render ----- //

type PropTypes = {|
  selectedTab: ActiveTabState,
  setTabAction: typeof setTab
|};

class Content extends Component<PropTypes> {

  componentDidUpdate({ selectedTab }) {
    if (selectedTab !== this.props.selectedTab && this.tabRef) {
      // $FlowIgnore
      this.tabRef.focus({
        preventScroll: true,
      });
    }
  }

  tabRef: ?HTMLDivElement;

  render() {
    const { selectedTab, setTabAction } = this.props;

    const collectionPage = (
      <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(d) => { this.tabRef = d; }}>
        <ContentVoucherFaqBlock />
        <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below: Voucher" />
        <ContentHelpBlock
          faqLink={trackedLink(
            'https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions',
            'Subscriptions FAQs',
            sendClickedEvent('paper_subscription_collection_page-subscription_faq_link'),
          )}
          telephoneLink={trackedLink(
            'tel:+4403303336767',
            '0330 333 6767',
            sendClickedEvent('paper_subscription_collection_page-telephone_link'),
          )}
        />
      </div>
    );

    const deliveryPage = (
      <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(d) => { this.tabRef = d; }}>
        <ContentDeliveryFaqBlock setTabAction={setTabAction} />
        <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below: Delivery" />
        <ContentHelpBlock
          faqLink={trackedLink(
            'https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions',
            'Subscriptions FAQs',
            sendClickedEvent('paper_subscription_delivery_page-subscription_faq_link'),
          )}
          telephoneLink={trackedLink(
            'tel:+4403303336767', // yes, we're using a phone number as a link
            '0330 333 6767',
            sendClickedEvent('paper_subscription_delivery_page-telephone_link'),
          )}
        />
      </div>
    );

    return selectedTab === 'collection' ? (collectionPage) :
      deliveryPage;
  }
}


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: state.page.tab,
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Content);
