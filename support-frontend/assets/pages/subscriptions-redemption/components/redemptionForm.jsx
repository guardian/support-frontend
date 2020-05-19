// @flow

import React from 'react';
import { css } from '@emotion/core';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import { connect } from 'react-redux';
import type { CorporateCustomer, State } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import Button from 'components/button/button';
import ProductSummary from 'pages/subscriptions-redemption/components/productSummary/productSummary';

function mapStateToProps(state: State) {
  return state.page.corporateCustomer;
}

function RedemptionForm(props: CorporateCustomer) {
  const formCss = css`
    min-height: 550px;
  `;
  const paraCss = css`
    margin-bottom: 16px;
  `;

  const buttonText = 'Redeem';
  return (
    <div>
      <Content>
        <CheckoutLayout aside={(
          <ProductSummary />
        )}
        >
          <Form onSubmit={(ev) => {
            ev.preventDefault();
          }}
          >
            <FormSection title="The Guardian Digital Subscription Redemption">
              <div css={formCss}>
                <p css={paraCss}>
                  As a valued member of <strong>{props.name}</strong> we would like to invite you
                  to set up your subscription
                </p>
                <p css={paraCss}>
                  Your registration details will be sent to the group administrator to review
                </p>
                <p css={paraCss}>
                  On the next screen you will be prompted to set up a Guardian user account
                </p>
                <Button id="submit-button" type="submit">
                  {buttonText}
                </Button>
              </div>
            </FormSection>
          </Form>
        </CheckoutLayout>
      </Content>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps)(RedemptionForm);
