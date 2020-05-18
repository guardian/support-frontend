// @flow

import React from 'react';
import { css } from '@emotion/core';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import { connect } from 'react-redux';
import type { RedemptionFormState, State } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

function mapStateToProps(state: State) {
  return state.page.checkout;
}

function mapDispatchToProps() {
  return {};
}

function RedemptionForm(props: RedemptionFormState) {
  const formCss = css`
    min-height: 550px;
  `;
  return (
    <div>
      <Content>
        <CheckoutLayout>
          <Form onSubmit={(ev) => {
            ev.preventDefault();
            props.submitForm();
          }}
          >
            <FormSection title="The Guardian Digital Subscription Redemption">
              <div css={formCss}>Hello</div>
            </FormSection>
          </Form>
        </CheckoutLayout>
      </Content>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(RedemptionForm);
