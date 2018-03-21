// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';


// ----- Component ----- //

export default function ThreeSubscriptions() {

  return (
    <div className="component-three-subscriptions">
      <PageSection heading="Subscribe" modifierClass="three-subscriptions">
        <SubscriptionBundle
          modifierClass="digital"
          heading="Digital"
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
          ctaUrl="https://subscribe.theguardian.com/p/DXX83X"
          ctaId="digital-sub"
          ctaAccessibilityHint="The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial."
          gridImage={{
            gridId: 'digitalCircle', srcSizes: [825, 500, 140], sizes: '(max-width: 480px) 90vw, (max-width: 660px) 400px, 165px', altText: 'digital subscription', imgType: 'png',
          }}
        />
        <SubscriptionBundle
          modifierClass="paper"
          heading="Paper"
          subheading="from £10.36/month"
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
          ctaUrl="https://subscribe.theguardian.com/p/GXX83P"
          ctaId="paper-sub"
          ctaAccessibilityHint="Proceed to paper subscription options, starting at ten pounds seventy nine pence per month."
          gridImage={{
            gridId: 'paperCircle', srcSizes: [825, 500, 140], sizes: '(max-width: 480px) 90vw, (max-width: 660px) 400px, 165px', altText: 'digital subscription', imgType: 'png',
          }}
        />
        <SubscriptionBundle
          modifierClass="paper-digital"
          heading="Paper+digital"
          subheading="from £21.62/month"
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
          ctaText="Get a paper+digital subscription"
          ctaUrl="https://subscribe.theguardian.com/p/GXX83X"
          ctaId="paper-digi-sub"
          ctaAccessibilityHint="Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription"
          gridImage={{
            gridId: 'paperDigitalCircle', srcSizes: [825, 500, 140], sizes: '(max-width: 480px) 90vw, (max-width: 660px) 400px, 165px', altText: 'digital subscription', imgType: 'png',
          }}
        />
      </PageSection>
    </div>
  );

}
