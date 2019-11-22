// @flow

import React from 'react';
import type { AmazonPayObjects } from 'helpers/checkouts.js'
import {connect} from "react-redux";
import type {State} from "pages/contributions-landing/contributionsLandingReducer";

type PropTypes = {|
  amazonPayObjects: AmazonPayObjects,
|}

const mapStateToProps = (state: State) => ({
  amazonPayObjects: state.page.form.thirdPartyPaymentLibraries.ONE_OFF.AmazonPay,
});

const mapDispatchToProps = (dispatch: Function) => ({
});

class AmazonPayLoginButtonComponent extends React.Component<PropTypes> {
  createWidget(): void {
    console.log("creating widget")
    // TODO - get id properly
    window.OffAmazonPayments.Button('AmazonLoginButton', window.guardian.amazonPaySellerId.ONE_OFF.uat, {
      type: 'PwA',
      color: 'DarkGray',
      size: 'medium',
      authorization: () => {
        debugger;
        // TODO - popup false?
        const loginOptions = { scope: 'profile postal_code payments:widget payments:shipping_address', popup: true };
        const authRequest = this.props.amazonPayObjects.amazon.Login.authorize(loginOptions, window.location.href);
      },
      onError: (error) => {
        // something bad happened
        debugger;
      },
    });
  }

  componentDidMount(): void {
    if (this.props.amazonPayObjects) {
      this.createWidget();
    }
  }

  componentDidUpdate(): void {
    if (this.props.amazonPayObjects) {
      this.createWidget();
    }
  }

  render() {
    if (this.props.amazonPayObjects) {
      return (
        <div>
          Amazon Pay!
          <div id="AmazonLoginButton" />
        </div>
      );
    } else {
      //TODO - spinner?
      console.log("amazon not ready")
      return null;
    }
  }
}

const AmazonPayLoginButton = connect(mapStateToProps, mapDispatchToProps)(AmazonPayLoginButtonComponent);
export default AmazonPayLoginButton
