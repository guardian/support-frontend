// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withVerticalCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

import Footer from 'components/footerCompliant/Footer';
import SubscriptionTermsPrivacy
  from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';


const stories = storiesOf('Footer', module)
  .addDecorator(withKnobs)
  .addDecorator(withVerticalCenterAlignment);

stories.add('Footer', () => {
  const contents = boolean('Show contents', true);
  return (
    <div style={{ width: '100%' }}>
      <Footer
        faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
        termsConditionsLink="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions"
      >
        {contents &&
          <>
            <SubscriptionTermsPrivacy subscriptionProduct="DigitalPack" />
            <CustomerService
              selectedCountryGroup="GBPCountries"
              subscriptionProduct="DigitalPack"
              paperFulfilmentOptions={null}
            />
            <SubscriptionFaq subscriptionProduct="DigitalPack" />
          </>
        }
      </Footer>
    </div>
  );
});
