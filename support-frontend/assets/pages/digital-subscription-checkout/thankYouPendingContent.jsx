// @flow

// ----- Imports ----- //

import * as React from 'react';

import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ThankYouHero from './components/thankYou/hero';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import OptInCopy from 'components/subscriptionCheckouts/thankYou/optInCopy';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { SubscriptionsSurvey } from 'components/subscriptionCheckouts/subscriptionsSurvey/SubscriptionsSurvey';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  marketingConsent: React.Node,
  includePaymentCopy: boolean,
};

// ----- Component ----- //

function ThankYouPendingContent(props: PropTypes) {

  return (
    <div className="thank-you-stage">
      <ThankYouHero
        countryGroupId={props.countryGroupId}
      />
      <HeroWrapper appearance="custom">
        <HeadingBlock>
          Your digital subscription is being processed
        </HeadingBlock>
      </HeroWrapper>
      <Content>
        <Text>
          <LargeParagraph>
            Thank you for subscribing to the Digital Subscription.
            Your subscription is being processed and you will
            receive an email when your account is live.
          </LargeParagraph>
          <p>
            If you require any further assistance, you can visit
            our {(
              <a
                onClick={sendTrackingEventsOnClick({
                  id: 'faq',
                  product: 'DigitalPack',
                  componentType: 'ACQUISITIONS_BUTTON',
                })}
                href="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
              >
              FAQs page
              </a>
            )} to find answers to common user issues. Alternatively, you can also
            visit our {(
              <a
                onClick={sendTrackingEventsOnClick({
                  id: 'help',
                  product: 'DigitalPack',
                  componentType: 'ACQUISITIONS_BUTTON',
                })}
                href="https://www.theguardian.com/help"
              >Help page
              </a>
            )} for customer support.
          </p>
        </Text>
      </Content>
      {props.includePaymentCopy ?
        <SubscriptionsSurvey product={DigitalPack} />
        : null
      }
      <Content>
        {props.marketingConsent}
        <OptInCopy subscriptionProduct={DigitalPack} />
      </Content>
    </div>
  );

}

// ----- Export ----- //

export default ThankYouPendingContent;
