// @flow

import React from 'react';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import { connect } from 'react-redux';
import type { State } from 'pages/promotion-terms/promotionTermsReducer';
import { LargeParagraph, Title } from 'components/text/text';
import Content, { Divider } from 'components/content/content';
import { formatUserDate } from 'helpers/dateConversions';
import UnorderedList from 'components/list/unorderedList';

const mapStateToProps = (state: State) => state.page.promotionTerms;

const PromoDetails = (props: PromotionTerms) => {
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
        <UnorderedList items={props.productRatePlans}/>
      </LargeParagraph>
      <Divider />
      <Title size={1}>Promotion terms and conditions</Title>
    </Content>
  );
};

export default connect(mapStateToProps)(PromoDetails);
