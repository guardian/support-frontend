// @flow

import React from 'react';
import { css } from '@emotion/core';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import { connect } from 'react-redux';
import type {
  RedemptionFormState,
  RedemptionPageState,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { Input } from 'components/forms/input';
import { compose } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import Button from 'components/button/button';
import ProductSummary from 'pages/subscriptions-redemption/components/productSummary/productSummary';

function mapStateToProps(state: RedemptionPageState) {
  return state.page.form;
}

const InputWithError = compose(asControlled, withError)(Input);

function RedemptionForm(props: RedemptionFormState) {
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
            <FormSection title="Welcome to The Guardian Digital Subscriptions">
              <div css={formCss}>
                <p css={paraCss}>
                  Activate your offer with the unique access code provided
                </p>
                <InputWithError
                  id="redemption-code"
                  type="text"
                  value={props.userCode}
                  setValue={() => {}}
                  error={props.error}
                />
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
