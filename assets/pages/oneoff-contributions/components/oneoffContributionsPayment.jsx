// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import ErrorMessage from 'components/errorMessage/errorMessage';

import type { Node } from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

type PropTypes = {
  email: string,
  error: ?string,
  formEmpty: boolean,
  stripeCallback: Function,
  amount: string,
  intCmp?: string,
  refpvid?: string,
  isoCountry: IsoCountry,
  payPalErrorHandler: (string) => void,
};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(formEmpty: boolean, error: ?string): Node {

  if (error !== null && error !== undefined) {
    return <ErrorMessage message={error} />;
  }

  return null;

}


// ----- Component ----- //

function OneoffContributionsPayment(props: PropTypes) {

  return (
    <section className="regular-contribution-payment">
      {getStatusMessage(props.formEmpty, props.error)}
      <StripePopUpButton email={props.email} callback={props.stripeCallback} />
      <PayPalContributionButton
        amount={props.amount}
        intCmp={props.intCmp}
        refpvid={props.refpvid}
        isoCountry={props.isoCountry}
        errorHandler={props.payPalErrorHandler}
      />
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    formEmpty: state.page.user.email === '' || state.page.user.fullName === '',
    amount: state.page.oneoffContrib.amount,
    intCmp: state.common.intCmp,
    refpvid: state.common.refpvid,
    isoCountry: state.common.country,
  };

}


// ----- Default Props ----- //

OneoffContributionsPayment.defaultProps = {
  intCmp: null,
  refpvid: null,
};


// ----- Exports ----- //

export default connect(mapStateToProps)(OneoffContributionsPayment);
