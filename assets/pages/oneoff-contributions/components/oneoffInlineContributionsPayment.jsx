// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import StripeInlineForm from 'components/stripeInlineForm/stripeInlineForm';
import ErrorMessage from 'components/errorMessage/errorMessage';

import { validateEmailAddress } from 'helpers/utilities';

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';

import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Status } from 'helpers/switch';
import { type Action as StripeInlineFormAction, stripeInlineFormActionsFor } from 'components/stripeInlineForm/stripeInlineFormActions';

import { checkoutError, type Action as OneOffCheckoutAction } from '../oneoffContributionsActions';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

type PropTypes = {|
  dispatch: Dispatch<*>,
  email: string,
  error: ?string,
  areAnyRequiredFieldsEmpty: boolean,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  checkoutError: (?string) => void,
  abParticipations: Participations,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  stripeSwitchStatus: Status,
  isStripeLoaded: boolean,
  stripeIsLoaded: () => void,
  stripeInlineErrorMessage: ?string,
  stripeInlineSetError: (string) => void,
  stripeInlineResetError: () => void,
|};

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    areAnyRequiredFieldsEmpty: !state.page.user.email || !state.page.user.fullName,
    amount: state.page.oneoffContrib.amount,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    currencyId: state.common.internationalisation.currencyId,
    stripeSwitchStatus: state.common.switches.oneOffPaymentMethods.stripe,
    isStripeLoaded: state.page.stripeInlineForm.isStripeLoaded,
    stripeInlineErrorMessage: state.page.stripeInlineForm.errorMessage,
  };
}

function mapDispatchToProps(dispatch: Dispatch<OneOffCheckoutAction | StripeInlineFormAction>) {
  return {
    dispatch,
    checkoutError: (message: ?string) => {
      dispatch(checkoutError(message));
    },
    stripeIsLoaded: () => {
      dispatch(stripeInlineFormActionsFor('oneOffContributions').stripeIsLoaded());
    },
    stripeInlineSetError: (message: string) => {
      dispatch(stripeInlineFormActionsFor('oneOffContributions').setError(message));
    },
    stripeInlineResetError: () => {
      dispatch(stripeInlineFormActionsFor('oneOffContributions').resetError());
    },
  };
}

// ----- Functions ----- //

// If the form is valid, calls the given callback, otherwise sets an error.
function formValidation(
  areAnyRequiredFieldsEmpty: boolean,
  validEmail: boolean,
  setError: ?string => void,
): () => boolean {

  return (): boolean => {

    if (!areAnyRequiredFieldsEmpty && validEmail) {
      if (setError) {
        setError(null);
      }
      return true;
    }

    if (setError) {
      if (areAnyRequiredFieldsEmpty) {
        setError('Please fill in all the fields above.');
      } else {
        setError('Please fill in a valid email address.');
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
      <StripeInlineForm
        email={props.email}
        callback={postCheckout(
          props.abParticipations,
          props.dispatch,
          props.amount,
          props.currencyId,
          props.referrerAcquisitionData,
          context.store.getState,
        )}
        canProceed={formValidation(
          props.areAnyRequiredFieldsEmpty,
          validateEmailAddress(props.email),
          props.checkoutError,
        )}
        stripeIsLoaded={props.stripeIsLoaded}
        isStripeLoaded={props.isStripeLoaded}
        currencyId={props.currencyId}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        switchStatus={props.stripeSwitchStatus}
        errorMessage={props.stripeInlineErrorMessage}
        setError={props.stripeInlineSetError}
        resetError={props.stripeInlineResetError}
        disable={false}
      />
    </section>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
