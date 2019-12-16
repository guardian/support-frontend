// @flow

// ----- Imports ----- //

import React, { type Element } from 'react';

import { connect } from 'react-redux';

import { HeroPicture } from 'pages/paper-subscription-landing/components/hero/hero';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

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

import { type FormFields, getFormFields } from 'helpers/subscriptionsForms/formFields';

// ----- Types ----- //

type PropTypes = {
    ...FormFields,
    isPending: boolean,
};


// ----- Component ----- //

const whatNext: {[FulfilmentOptions]: Element<*>} = {
  [HomeDelivery]: (
    <Text title="What happens next?">
      <OrderedList items={[
        <span>
          Look out for an email from us confirming your subscription.
          It has everything you need to know about how manage it in the future.
        </span>,
        <span>
          Your newspaper will be delivered to your door.
        </span>,
        ]}
      />

    </Text>
  ),
  [Collection]: (
    <Text title="What happens next?">
      <p>
        <OrderedList items={[
          <span>
            Look out for an email from us confirming your subscription.
            It has everything you need to know about how to manage it in the future.
          </span>,
          <span>
            You will receive your personalised book of vouchers.
          </span>,
          <span>
            Exchange your voucher for a newspaper at your newsagent or wherever you buy your paper
          </span>,
          ]}
        />

      </p>
    </Text>
  ),
};


function ThankYouContent({
  fulfilmentOption, productOption, startDate, isPending,
}: PropTypes) {

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
        {startDate &&
          <Text title={fulfilmentOption === HomeDelivery ? 'You will receive your newspapers from' : 'You can start using your vouchers from'}>
            <LargeParagraph>{formatUserDate(new Date(startDate))}</LargeParagraph>
          </Text>
        }
        {whatNext[fulfilmentOption]}
      </Content>
      <Content>
        <Text>
          <SansParagraph>
            You can manage your subscription by visiting our <a href={manageSubsUrl} onClick={sendTrackingEventsOnClick('checkout_mma', 'Paper', null)}>Manage section</a> or accessing
            it via <a href={myAccountUrl} onClick={sendTrackingEventsOnClick('checkout_my_account', 'Paper', null)}>your Guardian account</a>.
          </SansParagraph>
        </Text>
      </Content>
      <Content>
        <Asyncronously loader={import('components/subscriptionCheckouts/thankYou/marketingConsentContainer')}>
          {(MktConsent: MarketingConsent) => (

            <MktConsent
              render={({ title, message }) => (
                <Text title={title}>{message}</Text>
              )}
            />)
          }
        </Asyncronously>
        <Text>
          This is the option to choose if you want to hear about how to make the most of your print
          subscription, receive a dedicated weekly email from our membership editor and get more
          information on ways to support The Guardian.
        </Text>
      </Content>
    </div>
  );

}

// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
