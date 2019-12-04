// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import MarketingConsent from 'components/subscriptionCheckouts/thankYou/marketingConsentContainer';
import AppsSection from './appsSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ThankYouHero from './hero';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { type FormFields, getFormFields } from 'helpers/subscriptionsForms/formFields';
import { DirectDebit } from 'helpers/paymentMethods';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  ...FormFields,
  isPending?: boolean,
};

const getFirstParagraph = (paymentMethod, isPending) => {
  if (paymentMethod === DirectDebit) {
    return 'Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as \'Guardian Media Group\' on your bank statement.';
  } else if (isPending) {
    return 'Thank you for subscribing to the Digital Subscription. Your subscription is being processed and you will receive an email when your account is live.';
  }
  return 'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days.';
};


// ----- Component ----- //

function ThankYouContent(props: PropTypes) {

  return (
    <div className="thank-you-stage">
      <ThankYouHero
        countryGroupId={props.countryGroupId}
      />
      <HeroWrapper appearance="custom">
        <HeadingBlock>
          {props.isPending ? 'Your Digital Subscription is being processed' : 'Your Digital Subscription is now live'}
        </HeadingBlock>
      </HeroWrapper>
      <Content>
        <Text>
          <LargeParagraph>
            {getFirstParagraph(props.paymentMethod, props.isPending)}
          </LargeParagraph>
        </Text>
      </Content>
      {!props.isPending && (
        <Content>
          <Text title="Can&#39;t wait to get started?">
            <LargeParagraph>
              Just download the apps and log in with your Guardian account details.
            </LargeParagraph>
          </Text>
          <AppsSection countryGroupId={props.countryGroupId} />
        </Content>
      )}
      {props.isPending && (
        <Content>
          <Text>
            <p>
              If you require any further assistance, you can visit
              our {(
                <a
                  onClick={sendClickedEvent('dp checkout : faq')}
                  href="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
                >
                FAQs page
                </a>
              )} to find answers to common user issues. Alternatively, you can also
              visit our {(
                <a
                  onClick={sendClickedEvent('dp checkout : help')}
                  href="https://www.theguardian.com/help"
                >Help page
                </a>
              )} for customer support.
            </p>
          </Text>
        </Content>
      )}
      <Content>
        <MarketingConsent render={({ title, message }) => (
          <Text title={title}>{message}</Text>
        )}
        />
        <Text >
          This is the option to choose if you want to hear about how to make the most of your digital
          subscription, receive a dedicated weekly email from our membership editor and get more information
          on ways to support The Guardian.
        </Text>
      </Content>
    </div>
  );
}

ThankYouContent.defaultProps = {
  isPending: false,
};

// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
