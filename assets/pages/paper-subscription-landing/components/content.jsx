// @flow

// ----- Imports ----- //

import React, { Component, type Element } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { SansParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageTextBlockList from 'components/productPage/productPageTextBlock/productPageTextBlockList';
import ProductPageTextBlockOrderedList from 'components/productPage/productPageTextBlock/productPageTextBlockOrderedList';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
import GridImage from 'components/gridImage/gridImage';
import { paperSubsUrl } from 'helpers/routes';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';
import { flashSaleIsActive, getDiscount, getDuration } from 'helpers/flashSale';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../paperSubscriptionLandingPageActions';

import Form from './form';

import './content.scss';

type PropTypes = {|
  selectedTab: number,
  setTabAction: typeof setTab
|};

// ----- Auxiliary Components ----- //
const ContentHelpBlock = ({ faqLink, telephoneLink }: {faqLink: Element<string>, telephoneLink: Element<string>}) => (
  <ProductPageContentBlock type="feature" modifierClasses={['faqs']}>
    <ProductPageTextBlock title="FAQ and help">
      <SansParagraph>
      If you’ve got any more questions, you might well find the answers in the {faqLink}.
      </SansParagraph>
      <SansParagraph>
       If you can’t find the answer to your question here, please call our customer services team on {telephoneLink}.
      </SansParagraph>
    </ProductPageTextBlock>
  </ProductPageContentBlock>
);

function getPageInfoChip(): string {
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    return 'You can cancel your subscription at any time. Offer is for the first year. Standard subscription rates apply thereafter.';
  }
  return 'You can cancel your subscription at any time.';
}

const getSaleTitle = (): ?string => {

  if (!flashSaleIsActive('Paper', 'GBPCountries')) {
    return null;
  }

  const discount = getDiscount('Paper', 'GBPCountries');
  const duration = getDuration('Paper', 'GBPCountries');

  if (discount && duration) {
    return `Save an extra ${Math.round(discount * 100)}% for ${duration}`;
  } else if (discount) {
    return `Save an extra ${Math.round(discount * 100)}%`;
  }
  return null;

};

const ContentForm = ({ title, text }: {title: string, text?: Option<string>}) => (
  <ProductPageContentBlock type="feature" id="subscribe">
    <ProductPageTextBlock {...{ title }} callout={getSaleTitle()} />
    {text &&
      <ProductPageTextBlock>
        <p>{text}</p>
      </ProductPageTextBlock>
    }
    <Form />
    <ProductPageInfoChip>
      {getPageInfoChip()}
    </ProductPageInfoChip>
  </ProductPageContentBlock>
);
ContentForm.defaultProps = { text: null };


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
      <ProductPageTextBlockOrderedList items={[
        'Pick your subscription package below',
        'We’ll send you a book of vouchers that contain one voucher per paper in your subscription',
        'Take your voucher to your retailer. Your vouchers will be accepted at retailers across the UK, including most independent newsagents',
      ]}
      />
    </ProductPageTextBlock>
    <ProductPageTextBlock title="Giving you peace of mind">
      <ProductPageTextBlockList items={[
        'Pick your subscription package belowYour newsagent won’t lose out; we’ll pay them the same amount that they receive if you pay cash for your paper',
        'You can pause your subscription for up to four weeks a year. So if you’re heading away, you won’t have to pay for the papers you’ll miss',
      ]}
      />
    </ProductPageTextBlock>
  </ProductPageContentBlock>
);

const ContentDeliveryFaqBlock = ({ setTabAction }: {setTabAction: typeof setTab}) => {
  const linkToVouchers = (
    <a
      href={paperSubsUrl(false)}
      onClick={(ev) => {
        ev.preventDefault();
        setTabAction('collection');
      }}
    >
      subscribe using our voucher scheme
    </a>
  );

  return (
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
          worry if you live outside this area you can still {linkToVouchers}.
        </p>
        <ProductPageTextBlockOrderedList items={[
        'Select your subscription below and checkout',
        'Your subscribing deliveries will begin as quickly as five days  from you subscribing',
        ]}
        />
      </ProductPageTextBlock>
      <ProductPageTextBlock title="Giving you peace of mind">
        <ProductPageTextBlockList items={[
        'Your paper will arrive before 7am from Monday to Saturday and before 8.30am on Sunday',
        'We can’t delivery to individual flats, or apartments within blocks because we need access to your post box to deliver your paper',
        'You can pause your subscription for up to 36 days a year. So if you’re going away anywhere, you won’t have to pay for the papers that you miss',
        ]}
        />
      </ProductPageTextBlock>
    </ProductPageContentBlock>

  );
};

function trackedLink(href: string, text: string, onClick: Function) {
  return <a href={href} onClick={onClick}>{text}</a>;
}


// ----- Render ----- //

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
        <ContentForm title="Pick your subscription package below: Voucher" />
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
        <ContentForm title="Pick your subscription package below: Delivery" />
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
