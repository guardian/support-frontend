// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import StripePopUpButton from 'components/paymentButtons/stripePopUpButton/stripePopUpButton';
import PayPalContributionButton from 'containerisableComponents/payPalContributionButton/payPalContributionButton';
import ErrorMessage from 'components/errorMessage/errorMessage';

import { validateEmailAddress } from 'helpers/utilities';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { Currency } from 'helpers/internationalisation/currency';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Status } from 'helpers/switch';

import { checkoutError, type Action } from '../oneoffContributionsActions';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

type PropTypes = {
  dispatch: Function,
  email: string,
  error: ?string,
  isFormEmpty: boolean,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  checkoutError: (?string) => void,
  abParticipations: Participations,
  currency: Currency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  stripeSwitchStatus: Status,
  payPalSwitchStatus: Status,
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    isFormEmpty: state.page.user.email === '' || state.page.user.fullName === '',
    amount: state.page.oneoffContrib.amount,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    isoCountry: state.common.internationalisation.countryId,
    countryGroupId: state.common.internationalisation.countryGroupId,
    abParticipations: state.common.abParticipations,
    currency: state.common.currency,
    stripeSwitchStatus: state.common.switches.oneOffPaymentMethods.stripe,
    payPalSwitchStatus: state.common.switches.oneOffPaymentMethods.payPal,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    dispatch,
    checkoutError: (message: ?string) => {
      dispatch(checkoutError(message));
    },
  };
}

// ----- Functions ----- //

// If the form is valid, calls the given callback, otherwise sets an error.
function formValidation(
  isFormEmpty: boolean,
  validEmail: boolean,
  error: ?string => void,
): Function {

  return (): boolean => {

    if (!isFormEmpty && validEmail) {
      if (error) {
        error(null);
      }
      return true;
    }

    if (error) {
      if (isFormEmpty) {
        error('Please fill in all the fields above.');
      } else {
        error('Please fill in a valid email address.');
      }
    }
    return false;
  };

}


// ----- Component ----- //

/*
 * WARNING: we are using the React context here to be able to pass the getState function
 * to the postCheckout function. PostCheckout requires this function to access to the
 * most recent user.
 * More information here:https://reactjs.org/docs/context.html
 * You should not use context for other purposes. Please use redux.
 */
function OneoffContributionsPayment(props: PropTypes, context) {

  return (
    <section className="oneoff-contribution-payment">
      <ErrorMessage message={props.error} />
      <PayPalContributionButton
        amount={props.amount}
        referrerAcquisitionData={props.referrerAcquisitionData}
        isoCountry={props.isoCountry}
        countryGroupId={props.countryGroupId}
        errorHandler={props.checkoutError}
        abParticipations={props.abParticipations}
        switchStatus={props.payPalSwitchStatus}
      />
      <StripePopUpButton
        email={props.email}
        callback={postCheckout(
          props.abParticipations,
          props.dispatch,
          props.amount,
          props.currency,
          props.referrerAcquisitionData,
          context.store.getState,
        )}
        canOpen={formValidation(
          props.isFormEmpty,
          validateEmailAddress(props.email),
          props.checkoutError,
        )}
        currency={props.currency}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        amount={props.amount}
        switchStatus={props.stripeSwitchStatus}
      />
    </section>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
