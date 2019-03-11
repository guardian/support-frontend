// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { HeroPicture } from 'pages/paper-subscription-landing/components/hero/hero';
import { HomeDelivery, Collection } from 'helpers/productPrice/fulfilmentOptions';

import OrderedList from 'components/list/orderedList';
import Asyncronously from 'components/asyncronously/asyncronously';
import Content from 'components/content/content';
import Text, { SansParagraph, LargeParagraph } from 'components/text/text';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { manageSubsUrl, myAccountUrl } from 'helpers/externalLinks';
import typeof MarketingConsent from './marketingConsentContainer';
import styles from './thankYou.module.scss';
import { formatUserDate } from '../helpers/deliveryDays';

import {
  getFormFields,
  type FormFields,
} from '../paperSubscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {
    ...FormFields,
    isPending: boolean,
};


// ----- Component ----- //

const whatNext = {
  [HomeDelivery]: (
    <Text title="What happens next?">
      <OrderedList items={[
        <span>
          Look out for an email from us confirming your subscription.
          It has everything you need to know about how manage it in the future.
        </span>,
        <span>
          Your newspaper will be delivered to your door. Here{'\''}s a reminder of how home delivery works.
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
            It has everything you need to know about how manage it in the future.
          </span>,
          <span>
            You will receive your personalised book of vouchers.
            Here{'\''}s a reminder of how the voucher booklet works.
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
    <div>
      <HeroWrapper appearance="custom" className={styles.hero}>
        <HeroPicture />
        <HeadingBlock
          overheading="Thank you for supporting our journalism!"
        >
          {isPending ?
          `Your subscription to the ${productOption} package is being processed` :
          `You are now subscribed to the ${productOption} package`
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
          <Text title="Your first issue will arrive on">
            <LargeParagraph>{formatUserDate(new Date(startDate))}</LargeParagraph>
          </Text>
        }
        {whatNext[fulfilmentOption]}
      </Content>
      <Content>
        <Text>
          <SansParagraph>
            You can manage your subscription by visiting our <a href={manageSubsUrl}>Manage section</a> or accessing
            it via <a href={myAccountUrl}>your Guardian account</a>.
          </SansParagraph>
        </Text>
      </Content>
      <Content>
        <Asyncronously loader={import('./marketingConsentContainer')}>
          {(MktConsent: MarketingConsent) => (

            <MktConsent
              render={({ title, message }) => (
                <Text title={title}>{message}</Text>
              )}
            />)
          }
        </Asyncronously>
      </Content>
    </div>
  );

}

// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
