// @flow

import React from 'react';
import Content, { Divider } from 'components/content/content';
import { Title } from 'components/text/text';
import { DigitalPack, GuardianWeekly } from 'helpers/subscriptions';
import WeeklyTerms from 'pages/promotion-terms/weeklyTerms';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';
import DigitalPackTerms from 'pages/promotion-terms/DigitalPackTerms';

const getTermsForProduct = (props: PromotionTermsPropTypes) => {
  switch (props.promotionTerms.product) {
    case GuardianWeekly:
      return <WeeklyTerms {...props} />;
    case DigitalPack:
      return <DigitalPackTerms {...props.promotionTerms} />
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
