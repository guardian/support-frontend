// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';

import ProgressMessage from 'components/progressMessage/progressMessage';

import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import type {
  Action,
  CorporateCustomer,
  RedemptionPageState,
  Stage,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { DigitalPack } from 'helpers/subscriptions';
import { Dispatch } from 'redux';
import type { User } from 'helpers/subscriptionsForms/user';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';
import { createSubscription } from 'pages/subscriptions-redemption/api';

// ----- Types ----- //

type PropTypes = {|
  stage: Stage,
  corporateCustomer: CorporateCustomer,
  user: User,
  currencyId: IsoCurrency,
  countryId: IsoCountry,
  participations: Participations,
  processingFunction: PropTypes => void,
|};

type StagePropTypes = {
  stage: Stage,
  checkoutForm: Node,
  thankYouContentPending: Node,
  thankYouContent: Node,
}

// ----- State/Props Maps ----- //

function mapStateToProps(state: RedemptionPageState) {
  return {
    stage: state.page.stage,
    corporateCustomer: state.page.corporateCustomer,
    user: state.page.user,
    currencyId: state.common.internationalisation.currencyId,
    countryId: state.common.internationalisation.countryId,
    participations: state.common.abParticipations,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    processingFunction: (
      props: PropTypes
    ) => createSubscription(props.corporateCustomer, props.user, props.currencyId, props.countryId, props.participations, dispatch)
  };
}

// ----- Component ----- //

function CheckoutStage(props: StagePropTypes) {
  switch (props.stage) {
    case 'thankyou':
      return (
        <div>
          {props.thankYouContent}
          <ReturnSection subscriptionProduct={DigitalPack} />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div>
          {props.thankYouContentPending}
          <ReturnSection subscriptionProduct={DigitalPack} />
        </div>
      );

    case 'processing':
      props.processingFunction(props);
      return (
        <div className="checkout-content">
          {props.checkoutForm}
          <ProgressMessage message={['Processing transaction', 'Please wait']} />
        </div>
      );

    default:
      return (
        <div className="checkout-content">
          {props.checkoutForm}
        </div>
      );
  }
}

// ----- Export ----- //

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutStage);
