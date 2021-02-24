// @flow

import React from 'react';
import type { AmazonPayData, State } from 'pages/contributions-landing/contributionsLandingReducer';
import { type Action, setAmazonPayWalletWidgetReady, setAmazonPayOrderReferenceId, setAmazonPayPaymentSelected } from 'pages/contributions-landing/contributionsLandingActions';
import { connect } from 'react-redux';
import './AmazonPay.scss';
import { logException } from 'helpers/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { ContributionType } from 'helpers/contributions';

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayWalletWidgetReady: boolean => Action,
  setAmazonPayOrderReferenceId: string => Action,
  setAmazonPayPaymentSelected: boolean => Action,
  isTestUser: boolean,
  contributionType: ContributionType,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
  contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayWalletWidgetReady: (isReady: boolean) => dispatch(setAmazonPayWalletWidgetReady(isReady)),
  setAmazonPayOrderReferenceId:
    (orderReferenceId: string) => dispatch(setAmazonPayOrderReferenceId(orderReferenceId)),
  setAmazonPayPaymentSelected: (paymentSelected: boolean) =>
    dispatch(setAmazonPayPaymentSelected(paymentSelected)),
});

const getSellerId = (isTestUser: boolean): string => (isTestUser ?
  window.guardian.amazonPaySellerId.uat :
  window.guardian.amazonPaySellerId.default);

class AmazonPayWalletComponent extends React.Component<PropTypes, void> {

  componentDidMount(): void {
    const { amazonLoginObject, amazonPaymentsObject } = this.props.amazonPayData.amazonPayLibrary;
    if (amazonLoginObject && amazonPaymentsObject) {
      this.createWidget(amazonPaymentsObject);
    }
  }

  componentDidUpdate(): void {
    const { amazonLoginObject, amazonPaymentsObject } = this.props.amazonPayData.amazonPayLibrary;
    if (amazonLoginObject && amazonPaymentsObject && !this.props.amazonPayData.walletWidgetReady) {
      this.createWidget(amazonPaymentsObject);
    }
  }

  createWidget(amazonPaymentsObject: Object): void {
    this.props.setAmazonPayPaymentSelected(false); // in case we've previously created a wallet

    const walletConfig = {
      sellerId: getSellerId(this.props.isTestUser),
      design: { designMode: 'responsive' },
      onPaymentSelect: (foo) => {
        console.log('onPaymentSelect MAY NEED TO PROVIDE A CONTINUE BUTTON...', foo);
        this.props.setAmazonPayPaymentSelected(true);
      },
      onError: (error) => {
        // The widget UI will display an error to the user, so we can just log it
        logException(`Amazon Pay wallet error: ${error.getErrorMessage()}`);
      },
    };

    if (this.props.contributionType !== 'ONE_OFF') { // todo SWITCH BACK TO ===
      walletConfig.amazonOrderReferenceId = this.props.amazonPayData.orderReferenceId;
      walletConfig.onOrderReferenceCreate = (orderReference) => {
        this.props.setAmazonPayOrderReferenceId(orderReference.getAmazonOrderReferenceId());
      };
    } else {
      walletConfig.onReady = (billingAgreement) => {
        amazonPaymentsObject.amazonBillingAgreementId = billingAgreement.getAmazonBillingAgreementId();
        console.log('BILLING AGREEMENT NEEDS CONSENT, DON\'T GIVE THIS TO Zuora YET', amazonPaymentsObject.amazonBillingAgreementId);
        this.createConsentWidget(amazonPaymentsObject);
      };
      walletConfig.agreementType = 'BillingAgreement';
    }

    new amazonPaymentsObject.Widgets.Wallet(walletConfig).bind('WalletWidgetDiv');

    this.props.setAmazonPayWalletWidgetReady(true);
  }

  createConsentWidget(amazonPaymentsObject: Object): void {
    const consentConfig = {
      amazonBillingAgreementId: amazonPaymentsObject.amazonBillingAgreementId,
      sellerId: getSellerId(this.props.isTestUser),
      design: { designMode: 'responsive' },
      onReady: (billingAgreementConsentStatus) => {
        const buyerBillingAgreementConsentStatus = `${billingAgreementConsentStatus.getConsentStatus()}` === 'true';
        if (buyerBillingAgreementConsentStatus) {
          console.log('onReady YOU CAN GIVE THIS TO Zuora NOW', amazonPaymentsObject.amazonBillingAgreementId);
          // SEND DATA TO STEP FUNCTION
        } else {
          console.log('onReady BILLING AGREEMENT CONSENT NOT GIVEN YET');
        }
      },
      onConsent: (billingAgreementConsentStatus) => {
        const buyerBillingAgreementConsentStatus = `${billingAgreementConsentStatus.getConsentStatus()}` === 'true';
        if (buyerBillingAgreementConsentStatus) {
          console.log('onConsent YOU CAN GIVE THIS TO Zuora NOW', amazonPaymentsObject.amazonBillingAgreementId);
          // SEND DATA TO STEP FUNCTION
        } else {
          console.log('onConsent BILLING AGREEMENT CONSENT IS REQUIRED');
        }
      },
      onError: (error) => {
        // The widget UI will display an error to the user, so we can just log it
        logException(`Amazon Pay consent error: ${error.getErrorMessage()}`);
      },
    };

    new amazonPaymentsObject.Widgets.Consent(consentConfig).bind('ConsentWidgetDiv');

    this.props.setAmazonPayWalletWidgetReady(true);
  }

  render() {
    const { amazonLoginObject, amazonPaymentsObject } = this.props.amazonPayData.amazonPayLibrary;
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
  }
}

const AmazonPayWallet = connect(mapStateToProps, mapDispatchToProps)(AmazonPayWalletComponent);

export default AmazonPayWallet;
