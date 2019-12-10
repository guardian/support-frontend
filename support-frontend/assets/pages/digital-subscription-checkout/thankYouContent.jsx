// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import MarketingConsent from 'components/subscriptionCheckouts/thankYou/marketingConsentContainer';
import AppsSection from './components/thankYou/appsSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ThankYouHero from './components/thankYou/hero';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { type FormFields, getFormFields } from 'helpers/subscriptionsForms/formFields';
import { DirectDebit } from 'helpers/paymentMethods';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
    ...FormFields,
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
          Your Digital Subscription is now live
        </HeadingBlock>
      </HeroWrapper>
      <Content>
        <Text>
          <LargeParagraph>
            {
            props.paymentMethod === DirectDebit ?
            'Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as \'Guardian Media Group\' on your bank statement.' :
            'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days.'
          }
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

// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
