// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { type ThankYouPageStageMap, type ThankYouPageStage } from '../../../contributionsLandingReducer';
import ContributionThankYou from './ContributionThankYou';
import ContributionThankYouSetPassword from './ContributionThankYouSetPassword';
import ContributionThankYouPasswordSet from './ContributionThankYouPasswordSet';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { PaymentMethod } from 'helpers/paymentMethods';
import type { ContributionType } from 'helpers/contributions';
import { trackUserData } from '../utils/ophan';
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  thankYouPageStage: ThankYouPageStage,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
  email: string,
  contributionType: ContributionType,
  isSignedIn: boolean,
  isKnownEmail: boolean,
  paymentMethod: PaymentMethod,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
  countryId: state.common.internationalisation.countryId,
  countryGroupId: state.common.internationalisation.countryGroupId,
  email: state.page.form.formData.email,
  contributionType: state.page.form.contributionType,
  isSignedIn: state.page.user.isSignedIn,
  isKnownEmail: state.page.form.guestAccountCreationToken === null,
  paymentMethod: state.page.form.paymentMethod,
});

// ----- Render ----- //

function ContributionThankYouContainer(props: PropTypes) {

  useEffect(() => {
    trackUserData(
      props.paymentMethod,
      props.contributionType,
      props.isSignedIn,
      props.isKnownEmail,
    );
  }, []);

  const thankYouPageStage: ThankYouPageStageMap<React$Element<*>> = {
    thankYou: (
      <ContributionThankYou countryGroupId={props.countryGroupId} email={props.email} />
    ),
    thankYouSetPassword: (
      <ContributionThankYouSetPassword />
    ),
    thankYouPasswordDeclinedToSet: (
      <ContributionThankYou countryGroupId={props.countryGroupId} email={props.email} />
    ),
    thankYouPasswordSet: (
      <ContributionThankYouPasswordSet
        countryId={props.countryId}
        countryGroupId={props.countryGroupId}
      />
    ),
  };

  return (
    <div className="gu-content__content gu-content__content-thankyou">
      {thankYouPageStage[props.thankYouPageStage]}
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYouContainer);
