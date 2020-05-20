// @flow

// ----- Imports ----- //

import React from 'react';

import type { SubscriptionProduct } from 'helpers/subscriptions';

import AnchorButton from 'components/button/anchorButton';
import Text from 'components/text/text';
import Content from 'components/content/content';

type PropTypes = {|
  product: SubscriptionProduct,
|};

const surveyLinks: {[key: SubscriptionProduct]: string} = {
  DigitalPack: 'https://www.surveymonkey.co.uk/r/QF9ZGQR',
  GuardianWeekly: 'https://www.surveymonkey.co.uk/r/QFNYV5G',
  Paper: 'https://www.surveymonkey.co.uk/r/Q37XNTV',
};

export const SubscriptionsSurvey = ({ product }: PropTypes) => {
  const surveyLink = surveyLinks[product];
  const title = 'Tell us about your subscription';
  const message = 'Please fill out this short form to help us learn a little more about your support for The Guardian';

  return surveyLink ? (
    <Content>
      <section className="component-subscriptions-survey">
        <Text title={title}>{message}</Text>
        <AnchorButton
          href={surveyLink}
          appearance="secondary"
          aria-label="Link to subscription survey"
        >
            Share your thoughts
        </AnchorButton>
      </section>
    </Content>
  ) : null;
};
