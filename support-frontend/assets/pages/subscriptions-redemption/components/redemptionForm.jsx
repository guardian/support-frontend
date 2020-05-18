// @flow

import React from 'react';
import { css } from '@emotion/core';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import { connect } from 'react-redux';
import type { State } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import { compose } from 'redux';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import Button from 'components/button/button';
import type { Option } from 'helpers/types/option';

type PropTypes = {
  userCode: Option<string>,
  error: Option<string>,
  submitForm: () => void,
}

function mapStateToProps(state: State) {
  return state.page.form;
}

function mapDispatchToProps(dispatch) {
  return {
    submitForm: () => {
      console.log('submit');
      dispatch({ type: 'test' });
    },
  };
}

const InputWithError = compose(asControlled, withError, withLabel)(Input);

function RedemptionForm(props: PropTypes) {
  const formCss = css`
    min-height: 550px;
  `;
  const buttonText = 'Redeem';
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
              <div css={formCss}>
                <InputWithError
                  id="redemption-code"
                  label="Insert your code"
                  type="text"
                  value={props.userCode}
                  setValue={() => {}}
                  error={props.error}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(RedemptionForm);
