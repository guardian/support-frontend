// @flow

// ----- Imports ----- //

import React from 'react';

import { connect } from 'react-redux';

import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import OrderedList from 'components/list/orderedList';
import Asyncronously from 'components/asyncronously/asyncronously';
import Content from 'components/content/content';
import Text, { LargeParagraph, SansParagraph } from 'components/text/text';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { manageSubsUrl, myAccountUrl } from 'helpers/externalLinks';
import typeof MarketingConsent from 'components/subscriptionCheckouts/thankYou/marketingConsentContainer';
import styles from 'components/subscriptionCheckouts/thankYou/thankYou.module.scss';
import { formatUserDate } from 'helpers/dateConversions';
import OptInCopy from 'components/subscriptionCheckouts/thankYou/optInCopy';
import { Paper } from 'helpers/subscriptions';
import { SubscriptionsSurvey } from 'components/subscriptionCheckouts/subscriptionsSurvey/SubscriptionsSurvey';
import { HeroPicture } from './heroPicture';

import { type FormFields, getFormFields } from 'helpers/subscriptionsForms/formFields';

// ----- Types ----- //

type PropTypes = {
    ...FormFields,
    isPending: boolean,
    useDigitalVoucher: boolean,
};

// ----- Map State/Props ----- //

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    ...getFormFields(state),
    useDigitalVoucher: state.common.settings.useDigitalVoucher,
  };
}

// ----- Component ----- //

const whatNextText: { [FulfilmentOptions]: { [key: string]: Array<string> } } = {
  [HomeDelivery]: {
    default: [
      `Look out for an email from us confirming your subscription.
        It has everything you need to know about how manage it in the future.`,
      'Your newspaper will be delivered to your door.',
    ],
  },
  [Collection]: {
    default: [
      `Look out for an email from us confirming your subscription.
        It has everything you need to know about how to manage it in the future.`,
      'You will receive your personalised book of vouchers.',
      'Exchange your voucher for a newspaper at your newsagent or wherever you buy your paper',
    ],
    digitalVoucher: [
      `Keep an eye on your inbox. You should receive an email confirming the details of your subscription,
        and another email shortly afterwards that contains details of how you can pick up your papers from tomorrow!`,
      `You will receive your Subscription Card in your subscriber pack in the post, along with your home
        delivery letter.`,
      `Visit your chosen participating newsagent to pick up your paper using your Subscription Card, or
        arrange a home delivery using your delivery letter.`,
    ],
  },
};

function whatNextElement(textItems) {
  return (
    <Text title="What happens next?">
      <p>
        <OrderedList items={textItems.map(item => <span>{item}</span>)} />
      </p>
    </Text>
  );
}

function WhatNext(fulfilmentOption, useDigitalVoucher = false) {
  let textItems = whatNextText[fulfilmentOption].default;
  if (fulfilmentOption === Collection && useDigitalVoucher) {
    textItems = whatNextText[Collection].digitalVoucher;
  }
  return whatNextElement(textItems);
}


function ThankYouContent({
  fulfilmentOption, productOption, startDate, isPending, product, useDigitalVoucher,
}: PropTypes) {
  const hideStartDate = fulfilmentOption === Collection && useDigitalVoucher;
  return (
    <div className="thank-you-stage">
      <HeroWrapper appearance="custom" className={styles.hero}>
        <HeroPicture />
        <HeadingBlock
          overheading="Thank you for supporting our journalism!"
          overheadingClass="--thankyou"
        >
          {isPending ?
          `Your subscription to the ${productOption} package is being processed` :
          `You have now subscribed to the ${productOption} package`
  }
        </HeadingBlock>
      </HeroWrapper>
      <Content>
        {
          isPending && (
            <Text>
              <LargeParagraph>
                Your subscription is being processed and you will
                receive an email when it goes live.
              </LargeParagraph>
            </Text>
          )
        }
        {(startDate && !hideStartDate) &&
          <Text title={fulfilmentOption === HomeDelivery ? 'You will receive your newspapers from' : 'You can start using your vouchers from'}>
            <LargeParagraph>{formatUserDate(new Date(startDate))}</LargeParagraph>
          </Text>
        }
        {WhatNext(fulfilmentOption, useDigitalVoucher)}
      </Content>
      <Content>
        <Text>
          <SansParagraph>
            You can manage your subscription by visiting our <a href={manageSubsUrl} onClick={sendTrackingEventsOnClick({ id: 'checkout_mma', product: 'Paper', componentType: 'ACQUISITIONS_BUTTON' })}>Manage section</a> or accessing
            it via <a href={myAccountUrl} onClick={sendTrackingEventsOnClick({ id: 'checkout_my_account', product: 'Paper', componentType: 'ACQUISITIONS_BUTTON' })}>your Guardian account</a>.
          </SansParagraph>
        </Text>
      </Content>
      <SubscriptionsSurvey product={product} />
      <Content>
        <Asyncronously loader={import('components/subscriptionCheckouts/thankYou/marketingConsentContainer')}>
          {(MktConsent: MarketingConsent) => (

            <MktConsent />)
          }
        </Asyncronously>
        <OptInCopy subscriptionProduct={Paper} />
      </Content>
    </div>
  );

}

// ----- Export ----- //


export default connect(mapStateToProps)(ThankYouContent);
