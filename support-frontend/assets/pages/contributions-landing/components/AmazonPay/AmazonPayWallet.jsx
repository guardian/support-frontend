// @flow

import React from 'react';
import type { AmazonPayData, State } from 'pages/contributions-landing/contributionsLandingReducer';
import { type Action, setAmazonPayWalletWidgetReady, setAmazonPayOrderReferenceId, setAmazonPayPaymentSelected } from 'pages/contributions-landing/contributionsLandingActions';
import { connect } from 'react-redux';
import './AmazonPay.scss';
import { logException } from 'helpers/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayWalletWidgetReady: boolean => Action,
  setAmazonPayOrderReferenceId: string => Action,
  setAmazonPayPaymentSelected: boolean => Action,
  isTestUser: boolean,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
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

    new amazonPaymentsObject.Widgets.Wallet({
      sellerId: getSellerId(this.props.isTestUser),
      design: { designMode: 'responsive' },
      amazonOrderReferenceId: this.props.amazonPayData.orderReferenceId,
      onOrderReferenceCreate: (orderReference) => {
        this.props.setAmazonPayOrderReferenceId(orderReference.getAmazonOrderReferenceId());
      },
      onPaymentSelect: () => {
        this.props.setAmazonPayPaymentSelected(true);
      },
      onError: (error) => {
        // The widget UI will display an error to the user, so we can just log it
        logException(`Amazon Pay wallet error: ${error.getErrorMessage()}`);
      },
    }).bind('WalletWidgetDiv');

    this.props.setAmazonPayWalletWidgetReady(true);
  }

  render() {
    const { amazonLoginObject, amazonPaymentsObject } = this.props.amazonPayData.amazonPayLibrary;
    if (amazonLoginObject && amazonPaymentsObject) {
      trackComponentLoad('amazon-pay-wallet-loaded');
      return (
        <div>
          <div className="walletWidgetDiv" id="WalletWidgetDiv" />
        </div>
      );
    }
    return null;
  }
}

const AmazonPayWallet = connect(mapStateToProps, mapDispatchToProps)(AmazonPayWalletComponent);

export default AmazonPayWallet;
