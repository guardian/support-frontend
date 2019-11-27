// @flow

import React from 'react';
import type {AmazonPayData, State} from "../../contributionsLandingReducer";
import {setAmazonPayWalletWidgetReady} from "../../contributionsLandingActions";
import {connect} from "react-redux";
import './AmazonPay.scss';


const canCreateWidget = (amazonPayData: AmazonPayData) =>
  amazonPayData.amazonPayLibrary && !amazonPayData.walletWidgetReady;

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayWalletWidgetReady: () => Action,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayWalletWidgetReady: () => dispatch(setAmazonPayWalletWidgetReady),
});

class AmazonPayWalletComponent extends React.Component<PropTypes, void> {

  // constructor(props): void {
  //   super(props)
  //   // this.boundCreateWidget = this.createWidget.bind("WalletWidgetDiv");
  // }

  // boundCreateWidget: (props: PropTypes) => void
//
//   createWidget(): void {
//     console.log("creating wallet widget")
//     this.props.amazonPayData.amazonPayLibrary.amazonPaymentsObject.Widgets.Wallet({
//         // TODO - get id properly
//         sellerId: window.guardian.amazonPaySellerId.ONE_OFF.uat,
//       onOrderReferenceCreate: (orderReference) => {
//         // TODO - add this id to redux?
//         const orderReferenceId = orderReference.getAmazonOrderReferenceId();
//         debugger;
//
//     },
//       design: {
//       designMode: 'responsive',
//     },
//     onPaymentSelect(orderReference) {
//       // Replace this code with the action that you want to perform
//       // after the payment method is selected.
//       // Ideally this would enable the next action for the buyer
//       // such as a "Continue" or "Place Order" button.
//     },
//     onError(error) {
//
//       console.log("widget creation error:")
//       console.log(error)
//       debugger;
//       // Your error handling code.
//       // During development you can use the following
//       // code to view error messages:
//       // console.log(error.getErrorCode() + ': ' + error.getErrorMessage());
//       // See "Handling Errors" for more information.
//     },
//   })// TODO - where is bind coming from?
//
//     this.props.setAmazonPayWalletWidgetReady();
// }



componentDidMount(): void {
    new this.props.amazonPayData.amazonPayLibrary.amazonPaymentsObject.Widgets.Wallet({
      sellerId: window.guardian.amazonPaySellerId.ONE_OFF.uat,
      design:          { designMode: 'responsive' },
      onPaymentSelect: () => null,
      onError:         () => null,
  }).bind("WalletWidgetDiv");
  // if (canCreateWidget(this.props.amazonPayData)) {
  //   this.boundCreateWidget(this.props);
  //   this.createWidget();
  // }
}

  render() {
    // if (canCreateWidget(this.props.amazonPayData)) {
    //   // this.boundCreateWidget(this.props);
    //   this.createWidget();
    // }
      if (this.props.amazonPayData.amazonPayLibrary) {
        return (
          <div>
            Wallet rendering:
            <div className="walletWidgetDiv" id="WalletWidgetDiv" />
          </div>
        );
      } else {
        <div>
          Wallet not rendering:
        </div>
        //TODO - spinner?
        console.log("amazon wallet widget not ready")
        return null;
      }
    }
}

const AmazonPayWallet = connect(mapStateToProps, mapDispatchToProps)(AmazonPayWalletComponent);

export default AmazonPayWallet;
