// @flow

import React from 'react';
import type { Option } from 'helpers/types/option';
import type { FormFields } from 'components/subscriptionCheckouts/addressSearch/addressFieldsStore';
import Text from 'components/text/text';
import './addressDisplayText.scss';
import { countries } from 'helpers/internationalisation/country';

const addressLine = (string: Option<string>) => {
  if(string && string !== "")
    return <span>{string}<br/></span>
  return null;
};

const AddressDisplayText = (props: FormFields) => {
  return (
    <Text className="component-address-display">
      {addressLine(props.lineOne)}
      {addressLine(props.lineTwo)}
      {addressLine(props.city)}
      {addressLine(props.state)}
      {countries[props.country]}
    </Text>
  )
};

export default AddressDisplayText;
