// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { HeroPicture } from 'pages/paper-subscription-landing/components/hero/hero';

import OrderedList from 'components/list/orderedList';
import Asyncronously from 'components/asyncronously/asyncronously';
import Content from 'components/content/content';
import Text, { SansParagraph } from 'components/text/text';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import HeadingBlock from 'components/headingBlock/headingBlock';
import typeof MarketingConsent from './marketingConsentContainer';
import styles from './thankYou.module.scss';
import {
  getFormFields,
  type FormFields,
} from '../paperSubscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
    ...FormFields,
};


// ----- Component ----- //

function ThankYouContent(props: PropTypes) {

  return (
    <div>
      <HeroWrapper appearance="custom" className={styles.hero}>
        <HeroPicture />
        <HeadingBlock
          overheading="Thank you for supporting our journalism!"
        >
          You are now subscribed to the Every day package
        </HeadingBlock>
      </HeroWrapper>

      <Content>
        <Text title="What happens next?">
          <p>
            <OrderedList items={[
              'Look out for an email from us confirming your subscription. It has everything you need to know about how manage it in the future.',
              'You will receive your personalised book of vouchers. Here\'s a reminder of how the voucher booklet works.',
              'Exchange your voucher for a newspaper at your newsagent or wherever you buy your paper',
            ]}
            />

          </p>
        </Text>

      </Content>
      <Content>
        <Text>
          <SansParagraph>
            You can manage your subscription by visiting our Manage section or accessing it via your Guardian account.
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
