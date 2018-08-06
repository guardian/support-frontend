// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import { type Stage } from '../digitalSubscriptionCheckoutReducer';


// ----- Types ----- //

type PropTypes = {
  stage: Stage;
};


// ----- State/Props Maps ----- //

function mapStateToProps(state): PropTypes {

  return {
    stage: state.page.stage,
  };

}


// ----- Component ----- //

function CheckoutStage(props: PropTypes) {

  switch (props.stage) {

    case 'thankyou':
      return <div>Thank you page</div>;

    case 'checkout':
    default:
      return (
        <LeftMarginSection modifierClasses={['grey']}>
          <p>Placeholder</p>
        </LeftMarginSection>
      );

  }

}


// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
