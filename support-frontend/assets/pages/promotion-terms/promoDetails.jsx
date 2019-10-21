// @flow

import React from 'react';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import { LargeParagraph, Title } from 'components/text/text';
import Content from 'components/content/content';
import { formatUserDate } from 'helpers/dateConversions';
import UnorderedList from 'components/list/unorderedList';
import AnchorButton from 'components/button/anchorButton';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import { DigitalPack, Paper } from 'helpers/subscriptions';
import { routes } from 'helpers/routes';

const landingPageForProduct = (product: SubscriptionProduct) => {
  switch (product) {
    case DigitalPack:
      return routes.digitalSubscriptionLanding;
    case Paper:
      return routes.paperSubscriptionLanding;
    default:
      return routes.guardianWeeklySubscriptionLanding;
  }
};

export default function PromoDetails(props: PromotionTerms) {
  const validUntil = props.expires ? (
    <LargeParagraph>
      <strong>Valid until:</strong> {formatUserDate(props.expires)}
    </LargeParagraph>) : null;

  return (
    <Content>
      <Title size={1}>Promotional code: {props.promoCode}</Title>
      <LargeParagraph>
        <strong>Promotion details:</strong> {props.description}
      </LargeParagraph>
      {validUntil}
      <LargeParagraph>
        <strong>Applies to products:</strong>
        <UnorderedList items={
          // $FlowIgnore
          props.productRatePlans
        }
        />
      </LargeParagraph>
      <AnchorButton href={landingPageForProduct(props.product)}>Get this offer</AnchorButton>
    </Content>
  );
}

