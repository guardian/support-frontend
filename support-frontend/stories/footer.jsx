// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';

import { withKnobs } from '@storybook/addon-knobs';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

import Footer from 'components/footerCompliant/footer';
import SubscriptionTermsPrivacy
  from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';


const stories = storiesOf('Footer', module)
  .addDecorator(withKnobs)
  .addDecorator(withCenterAlignment);

stories.add('Footer', () => (
  <div style={{ width: '100%', maxWidth: '1700px' }}>
    <Footer>
      <SubscriptionTermsPrivacy subscriptionProduct="DigitalPack" />
      <CustomerService
        selectedCountryGroup="GBPCountries"
        subscriptionProduct="DigitalPack"
        paperFulfilmentOptions={null}
      />
      <SubscriptionFaq subscriptionProduct="DigitalPack" />
    </Footer>
  </div>
));
