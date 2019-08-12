// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { type Stage } from 'helpers/subscriptionsForms/formFields';
import Header from 'components/headers/header/header';

// ----- Types ----- //

type PropTypes = {|
  stage: Stage,
|};

// ----- State/Props Maps ----- //

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    stage: state.page.checkout.stage,
  };
}

// ----- Component ----- //

function HeaderWrapper(props: PropTypes) {
  return <Header display={props.stage === 'checkout' ? 'checkout' : 'guardianLogo'} />;
}

// ----- Export ----- //

export default connect(mapStateToProps)(HeaderWrapper);
