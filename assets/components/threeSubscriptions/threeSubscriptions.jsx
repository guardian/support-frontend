// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';


// ----- Component ----- //

export default function ThreeSubscriptions() {

  return (
    <PageSection heading="Subscribe" modifierClass="three-subscriptions">
      <SubscriptionBundle
        modifierClass="digital"
        heading="Digital subscription"
        subheading="£11.99/month"
        benefits={[
          {
            heading: 'Premium experience on the Guardian app',
            text: `No adverts means faster loading pages and a clearer reading experience.
              Play our daily crosswords offline wherever you are`,
          },
          {
            heading: 'Daily Tablet Edition app',
            text: `Read the Guardian, the Observer and all the Weekend supplements in an
              optimised tablet app; available on iPad`,
          },
        ]}
        ctaText="Start your 14 day trial"
        ctaLink="https://subscribe.theguardian.com/p/DXX83X"
      />
      <SubscriptionBundle
        modifierClass="paper"
        heading="Paper subscription"
        subheading="£10.79/month"
        benefits={[
          {
            heading: 'Choose your package and delivery method',
            text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
          },
          {
            heading: 'Save money on the retail price',
          },
        ]}
        ctaText="Get a paper subscription"
        ctaLink="https://subscribe.theguardian.com/p/GXX83P"
      />
      <SubscriptionBundle
        modifierClass="paper-digital"
        heading="Paper+digital"
        subheading="£22.06/month"
        benefits={[
          {
            heading: 'Choose your package and delivery method',
            text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
          },
          {
            heading: 'Save money on the retail price',
          },
          {
            heading: 'Get all the benefits of a digital subscription with paper + digital',
          },
        ]}
        ctaText="Get a paper + digital subscription"
        ctaLink="https://subscribe.theguardian.com/p/GXX83X"
      />
    </PageSection>
  );

}
