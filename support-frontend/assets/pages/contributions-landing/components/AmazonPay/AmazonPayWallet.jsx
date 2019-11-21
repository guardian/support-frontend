// @flow

import React from 'react';

type PropTypes = {|
|}

class AmazonPayWallet extends React.Component<PropTypes, void> {
  componentDidMount(): void {
    // new OffAmazonPayments.Widgets.Wallet({
    //   // TODO - get id properly
    //   sellerId: window.guardian.amazonPaySellerId.ONE_OFF.uat,
    //   onOrderReferenceCreate: (orderReference) => {
    //     // TODO - add this id to redux?
    //     const orderReferenceId = orderReference.getAmazonOrderReferenceId();
    //     debugger;
    //   },
    //   design: {
    //     designMode: 'responsive',
    //   },
    //   onPaymentSelect(orderReference) {
    //     // Replace this code with the action that you want to perform
    //     // after the payment method is selected.
    //     // Ideally this would enable the next action for the buyer
    //     // such as a "Continue" or "Place Order" button.
    //   },
    //   onError(error) {
    //     debugger;
    //     // Your error handling code.
    //     // During development you can use the following
    //     // code to view error messages:
    //     // console.log(error.getErrorCode() + ': ' + error.getErrorMessage());
    //     // See "Handling Errors" for more information.
    //   },
    // }).bind('WallerWidget'); // TODO - where is bind coming from?
  }

  render() {
    return (
      <div>
        <div id="WallerWidget" />
      </div>
    );
  }
}

export default AmazonPayWallet;
