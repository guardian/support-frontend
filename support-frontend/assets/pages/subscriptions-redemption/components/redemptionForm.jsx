// @flow

import React from 'react';
import { css } from '@emotion/core';
import { Button } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { line } from '@guardian/src-foundations/palette';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import Form from 'components/checkoutForm/checkoutForm';
import { connect } from 'react-redux';
import type { Action, RedemptionPageState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { type Dispatch } from 'redux';
import ProductSummary from 'pages/subscriptions-redemption/components/productSummary/productSummary';
import { submitCode, validateUserCode } from 'pages/subscriptions-redemption/api';
import type { Option } from 'helpers/types/option';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';
import type { ErrorMessage } from 'helpers/subscriptionsForms/validation';
import { TextInput } from '@guardian/src-text-input';
import { headline } from '@guardian/src-foundations/typography/obj';

type PropTypes = {
  userCode: Option<string>,
  error: Option<ErrorMessage>,
  setUserCode: string => void,
  submit: string => void,
}

function mapStateToProps(state: RedemptionPageState) {
  return {
    userCode: state.page.userCode,
    error: state.page.error,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setUserCode: (userCode: string) => validateUserCode(userCode, dispatch),
    submit: (userCode: string) => submitCode(userCode, dispatch),
  };
}

function RedemptionForm(props: PropTypes) {
  const mainCss = css`
    padding: ${space[2]}px;
  `;
  const instructionsDivCss = css`
    margin-top: -10px;
    padding: ${space[2]}px;
    ${from.tablet} {
      min-height: 475px;
    }
    hr {
      border: 0;
      border-top: solid 1px ${line.primary};
    }
  `;
  const hrCss = css`
    margin-bottom: 16px;
  `;
  const headingCss = css`
    ${headline.xsmall({ fontWeight: 'bold' })};
    margin-bottom: 16px;
  `;

  const validationText = props.error ? null : 'This code is valid';
  const signedIn = doesUserAppearToBeSignedIn();
  const buttonText = signedIn ? 'Activate' : 'Continue to account setup';

  return (
    <div>
      <Content>
        <CheckoutLayout
          wrapPosition="bottom"
          aside={(
            <ProductSummary />
          )}
        >
          <Form onSubmit={(ev) => {
            ev.preventDefault();
          }}
          >
            <div css={mainCss}>
              <h2 css={headingCss}>Enjoy your Digital Subscription from The Guardian</h2>
              <div>
                <TextInput
                  autoComplete="off"
                  value={props.userCode}
                  onChange={e => props.setUserCode(e.target.value)}
                  error={props.error}
                  success={validationText}
                  label="Insert code"
                  css={css`max-width: 300px`}
                />
              </div>
            </div>
            <div css={instructionsDivCss}>
              <hr css={hrCss} />
              <Button
                onClick={() => props.submit(props.userCode || '')}
                showIcon
                iconSide="right"
                icon={<SvgArrowRightStraight />}
              >
                {buttonText}
              </Button>
            </div>
          </Form>
        </CheckoutLayout>
      </Content>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(RedemptionForm);
