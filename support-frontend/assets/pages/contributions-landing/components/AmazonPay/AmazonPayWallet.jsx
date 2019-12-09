// @flow

import React from 'react';
import type { AmazonPayData, State } from 'pages/contributions-landing/contributionsLandingReducer';
import { type Action, setAmazonPayWalletWidgetReady, setAmazonPayOrderReferenceId, setAmazonPayPaymentSelected } from 'pages/contributions-landing/contributionsLandingActions';
import { connect } from 'react-redux';
import './AmazonPay.scss';
import { logException } from 'helpers/logger';

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayWalletWidgetReady: () => Action,
  setAmazonPayOrderReferenceId: string => Action,
  setAmazonPayPaymentSelected: boolean => Action,
  isTestUser: boolean,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayWalletWidgetReady: () => dispatch(setAmazonPayWalletWidgetReady),
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
    if (this.props.amazonPayData.amazonPayLibrary) {
      this.createWidget(this.props.amazonPayData.amazonPayLibrary);
    }
  }

  componentDidUpdate(): void {
    if (this.props.amazonPayData.amazonPayLibrary && !this.props.amazonPayData.walletWidgetReady) {
      this.createWidget(this.props.amazonPayData.amazonPayLibrary);
    }
  }

  createWidget(amazonPayLibrary: Object): void {
    this.props.setAmazonPayPaymentSelected(false); // in case we've previously created a wallet

    new amazonPayLibrary.amazonPaymentsObject.Widgets.Wallet({
      sellerId: getSellerId(this.props.isTestUser),
      design: { designMode: 'responsive' },
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

    this.props.setAmazonPayWalletWidgetReady();
  }

  render() {
    if (this.props.amazonPayData.amazonPayLibrary) {
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
