// @flow

import React from 'react';
import Content, { Divider } from 'components/content/content';
import { Title } from 'components/text/text';
import { GuardianWeekly } from 'helpers/subscriptions';
import WeeklyTerms from 'pages/promotion-terms/weeklyTerms';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';

const getTermsForProduct = (props: PromotionTermsPropTypes) => {
  switch (props.promotionTerms.product) {
    case GuardianWeekly:
      return <WeeklyTerms {...props} />;
    default: return null;
  }
};

export default function LegalTerms(props: PromotionTermsPropTypes) {

  return (
    <Content>
      <Divider />
      <Title size={1}>Promotion terms and conditions</Title>
      {getTermsForProduct(props)}
    </Content>
  );
}
