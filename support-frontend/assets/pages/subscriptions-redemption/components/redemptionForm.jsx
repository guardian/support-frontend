// @flow

import React from 'react';
import { css } from '@emotion/core';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import { connect } from 'react-redux';
import type {
  Action,
  CorporateCustomer,
  RedemptionPageState,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { Input } from 'components/forms/input';
import { compose, type Dispatch } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import Button from 'components/button/button';
import ProductSummary from 'pages/subscriptions-redemption/components/productSummary/productSummary';
import { fetchJson, requestOptions } from 'helpers/fetch';
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';
import { appropriateErrorMessage } from 'helpers/errorReasons';
import { getOrigin } from 'helpers/url';
import { doValidation } from 'pages/subscriptions-redemption/api';

function mapStateToProps(state: RedemptionPageState) {
  return state.page;
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setUserCode: (userCode: string) => dispatch({ type: 'SET_USER_CODE', userCode }),
    validateCode: (code: string) => doValidation(code, dispatch),
  };
}

const InputWithError = compose(asControlled, withError)(Input);

function redeemCodeUrl(redemptionCode: string) {
  return `${getOrigin()}/subscribe/redeem/create/${redemptionCode}`;
}

function submit() {
}

function RedemptionForm(props: RedemptionPageState) {
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
                  setValue={props.setUserCode}
                  error={props.error}
                />
                <p css={paraCss}>
                  On the next screen you will be prompted to set up a Guardian user account
                </p>
                <Button id="submit-button" onClick={() => props.validateCode(props.userCode)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(RedemptionForm);
