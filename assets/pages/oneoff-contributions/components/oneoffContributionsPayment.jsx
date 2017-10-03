// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import ErrorMessage from 'components/errorMessage/errorMessage';

import type { Node } from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';

import { checkoutError } from '../oneoffContributionsActions';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

export type PayPalButtonType = 'ContributionsCheckout' | 'NotSet';

type PropTypes = {
  email: string,
  error: ?string,
  isFormEmpty: boolean,
  amount: string,
  intCmp?: string,
  refpvid?: string,
  isoCountry: IsoCountry,
  checkoutError: (?string) => void,
};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(isFormEmpty: boolean, error: ?string): Node {

  if (error !== null && error !== undefined) {
    return <ErrorMessage message={error} />;
  }

  return null;

}

// If the form is valid, calls the given callback, otherwise sets an error.
function formValidation(
  isFormEmpty: boolean,
  error: ?string => void,
): Function => void {

  return (callback: Function) => {

    if (!isFormEmpty) {
      error(null);
      callback();
    } else {
      error('Please fill in all the fields above.');
    }

  };

}


// ----- Component ----- //

function OneoffContributionsPayment(props: PropTypes) {

  return (
    <section className="oneoff-contribution-payment">
      {getStatusMessage(props.isFormEmpty, props.error)}
      <StripePopUpButton
        email={props.email}
        callback={postCheckout}
        stripeClick={formValidation(props.isFormEmpty, props.checkoutError)}
      />
      <PayPalContributionButton
        amount={props.amount}
        intCmp={props.intCmp}
        refpvid={props.refpvid}
        isoCountry={props.isoCountry}
        errorHandler={props.checkoutError}
      />
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    isFormEmpty: state.page.user.email === '' || state.page.user.fullName === '',
    amount: state.page.oneoffContrib.amount,
    intCmp: state.common.intCmp,
    refpvid: state.common.refpvid,
    isoCountry: state.common.country,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    checkoutError: (message: ?string) => {
      dispatch(checkoutError(message));
    },
  };

}


// ----- Default Props ----- //

OneoffContributionsPayment.defaultProps = {
  intCmp: null,
  refpvid: null,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
