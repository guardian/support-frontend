// @flow

// $FlowIgnore - required for hooks
import React, { useEffect } from 'react';
import type {
  AmazonPayData,
  State,
} from 'pages/contributions-landing/contributionsLandingReducer';
import {
  type Action,
  setAmazonPayOrderReferenceId,
  setAmazonPayPaymentSelected,
  setAmazonPayBillingAgreementId,
  setAmazonPayBillingAgreementConsentStatus,
} from 'pages/contributions-landing/contributionsLandingActions';
import { connect } from 'react-redux';
import './AmazonPay.scss';
import { logException } from 'helpers/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { ContributionType } from 'helpers/contributions';

type PropTypes = {|
  amazonPayData: AmazonPayData,
  // setAmazonPayWalletWidgetReady: boolean => Action,
  setAmazonPayOrderReferenceId: string => Action,
  setAmazonPayPaymentSelected: boolean => Action,
  setAmazonPayBillingAgreementId: string => Action,
  setAmazonPayBillingAgreementConsentStatus: boolean => Action,
  isTestUser: boolean,
  contributionType: ContributionType
|};

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  // setAmazonPayWalletWidgetReady: (isReady: boolean) => dispatch(setAmazonPayWalletWidgetReady(isReady)),
  setAmazonPayOrderReferenceId: (orderReferenceId: string) =>
    dispatch(setAmazonPayOrderReferenceId(orderReferenceId)),
  setAmazonPayPaymentSelected: (paymentSelected: boolean) =>
    dispatch(setAmazonPayPaymentSelected(paymentSelected)),
  setAmazonPayBillingAgreementId: (amazonBillingAgreementId: string) =>
    dispatch(setAmazonPayBillingAgreementId(amazonBillingAgreementId)),
  setAmazonPayBillingAgreementConsentStatus: (amazonPayBillingAgreementConsentStatus: boolean) =>
    dispatch(setAmazonPayBillingAgreementConsentStatus(amazonPayBillingAgreementConsentStatus)),
});

const getSellerId = (isTestUser: boolean): string =>
  (isTestUser
    ? window.guardian.amazonPaySellerId.uat
    : window.guardian.amazonPaySellerId.default);

const AmazonPayWalletComponent = (props: PropTypes) => {
  const createWidget = (amazonPaymentsObject: Object): void => {
    props.setAmazonPayPaymentSelected(false); // in case we've previously created a wallet

    const baseWalletConfig = {
      sellerId: getSellerId(props.isTestUser),
      design: { designMode: 'responsive' },
      amazonOrderReferenceId: props.amazonPayData.orderReferenceId,
      onOrderReferenceCreate: (orderReference) => {
        props.setAmazonPayOrderReferenceId(orderReference.getAmazonOrderReferenceId());
      },
      onPaymentSelect: () => {
        props.setAmazonPayPaymentSelected(true);
      },
      onError: (error) => {
        // The widget UI will display an error to the user, so we can just log it
        logException(`Amazon Pay wallet error: ${error.getErrorMessage()}`);
      },
    };

    if (props.contributionType !== 'ONE_OFF') {
      new amazonPaymentsObject.Widgets.Wallet({
        ...baseWalletConfig,
        onReady: (billingAgreement) => {
          props.setAmazonPayBillingAgreementId(billingAgreement.getAmazonBillingAgreementId());
          console.log(
            'BILLING AGREEMENT NEEDS CONSENT, DON\'T GIVE THIS TO Zuora YET',
            billingAgreement.getAmazonBillingAgreementId(),
          );
        },
        agreementType: 'BillingAgreement',
      }).bind('WalletWidgetDiv');
    } else {
      new amazonPaymentsObject.Widgets.Wallet(baseWalletConfig).bind('WalletWidgetDiv');
    }
    // props.setAmazonPayWalletWidgetReady(true);
  };

  const createConsentWidget = (
    amazonPaymentsObject: Object,
    amazonBillingAgreementId: string,
  ): void => {
    const consentConfig = {
      amazonBillingAgreementId,
      sellerId: getSellerId(props.isTestUser),
      design: { designMode: 'responsive' },
      onReady: (billingAgreementConsentStatus) => {
        const amazonBillingAgreementConsentStatus =
          billingAgreementConsentStatus.getConsentStatus() === 'true';
        props.setAmazonPayBillingAgreementConsentStatus(amazonBillingAgreementConsentStatus);
      },
      onConsent: (billingAgreementConsentStatus) => {
        const amazonBillingAgreementConsentStatus =
          billingAgreementConsentStatus.getConsentStatus() === 'true';
        props.setAmazonPayBillingAgreementConsentStatus(amazonBillingAgreementConsentStatus);
      },
      onError: (error) => {
        logException(`Amazon Pay consent error: ${error.getErrorMessage()}`);
      },
    };

    new amazonPaymentsObject.Widgets.Consent(consentConfig).bind('ConsentWidgetDiv');
  };

  useEffect(() => {
    const { amazonPaymentsObject } = props.amazonPayData.amazonPayLibrary;
    if (amazonPaymentsObject) {
      createWidget(amazonPaymentsObject);
    }
  }, [props.amazonPayData.amazonPayLibrary.amazonPaymentsObject]);

  useEffect(() => {
    const { amazonPaymentsObject } = props.amazonPayData.amazonPayLibrary;
    if (amazonPaymentsObject && props.amazonPayData.amazonBillingAgreementId && props.contributionType !== 'ONE_OFF') {
      createConsentWidget(
        amazonPaymentsObject,
        props.amazonPayData.amazonBillingAgreementId,
      );
    }
  }, [
    props.amazonPayData.amazonPayLibrary.amazonPaymentsObject,
    props.amazonPayData.amazonBillingAgreementId,
    props.contributionType,
  ]);

  const {
    amazonLoginObject,
    amazonPaymentsObject,
  } = props.amazonPayData.amazonPayLibrary;

  if (amazonLoginObject && amazonPaymentsObject) {
    trackComponentLoad('amazon-pay-wallet-loaded');
    return (
      <div>
        <div className="walletWidgetDiv" id="WalletWidgetDiv" />
        <div className="consentWidgetDiv" id="ConsentWidgetDiv" />
      </div>
    );
  }
  return null;
};

const AmazonPayWallet = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AmazonPayWalletComponent);

export default AmazonPayWallet;
