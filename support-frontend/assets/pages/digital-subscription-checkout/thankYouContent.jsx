// @flow

// ----- Imports ----- //

import * as React from 'react';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import AppsSection from './components/thankYou/appsSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ThankYouHero from './components/thankYou/hero';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import OptInCopy from 'components/subscriptionCheckouts/thankYou/optInCopy';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';
import { SubscriptionsSurvey } from 'components/subscriptionCheckouts/subscriptionsSurvey/SubscriptionsSurvey';

// ----- Types ----- //

export type PropTypes = {
  countryGroupId: CountryGroupId,
  paymentMethod: Option<PaymentMethod>,
  marketingConsent: React.Node,
  includePaymentCopy: boolean,
};


// ----- Component ----- //

const getEmailCopy = (paymentMethod: Option<PaymentMethod>, includePaymentCopy: boolean) => {
  if (paymentMethod === DirectDebit) {
    return 'Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as \'Guardian Media Group\' on your bank statement.';
  } else if (includePaymentCopy) {
    return 'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days.';
  }
  return 'We have sent you an email with everything you need to know.';
};

function ThankYouContent(props: PropTypes) {
  return (
    <div className="thank-you-stage">
      <ThankYouHero
        countryGroupId={props.countryGroupId}
      />
      <HeroWrapper appearance="custom">
        <HeadingBlock>
          Your Digital Subscription is now live
        </HeadingBlock>
      </HeroWrapper>
      <Content>
        <Text>
          <LargeParagraph>
            {getEmailCopy(props.paymentMethod, props.includePaymentCopy)}
          </LargeParagraph>
        </Text>
      </Content>
      <Content>
        <Text title="Can&#39;t wait to get started?">
          <LargeParagraph>
            Just download the apps and log in with your Guardian account details.
          </LargeParagraph>
        </Text>
        <AppsSection countryGroupId={props.countryGroupId} />
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


export default ThankYouContent;
