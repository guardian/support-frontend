// @flow

// ----- Imports ----- //

import React from 'react';

import { type SubscriptionProduct, DigitalPack, GuardianWeekly } from 'helpers/subscriptions';
import Text from 'components/text/text';

type PropTypes = {
  subscriptionProduct: SubscriptionProduct,
}

const getProductText = (subscriptionProduct) => {
  if (subscriptionProduct === DigitalPack) {
    return 'digital ';
  } else if (subscriptionProduct === GuardianWeekly) {
    return 'Guardian Weekly ';
  }
  return 'print ';
};

// ----- Component ----- //

function OptInCopy(props: PropTypes) {
  const product = getProductText(props.subscriptionProduct);

  return (
    <Text>
      This is the option to choose if you want to hear about how to make the most of your {product}
      subscription, receive a {props.subscriptionProduct !== GuardianWeekly && 'dedicated'} weekly
      email from our {props.subscriptionProduct !== GuardianWeekly && 'membership'} editor and get
      more information on ways to support The Guardian.
    </Text>
  );

}


// ----- Exports ----- //

export default OptInCopy;
