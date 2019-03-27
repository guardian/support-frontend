// @flow

// ----- Imports ----- //

import React from 'react';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type Option } from 'helpers/types/option';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { AUDCountries, GBPCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';

// ----- Props ----- //

type PropTypes = {|
  selectedCountryGroup: CountryGroupId,
  subscriptionProduct: SubscriptionProduct,
  paperFulfilmentOptions: Option<PaperFulfilmentOptions>,
|};

// ----- Functions ----- //

function Email(props: { email: string }) {
  return (
    <a className="component-customer-service__email" href={`mailto:${props.email}`}>
      {props.email}
    </a>
  );
}

function productAndCountrySpecificEmail(
  selectedCountryGroup: CountryGroupId,
  subscriptionProduct: SubscriptionProduct,
  paperFulfilmentOptions: Option<PaperFulfilmentOptions>,
) {
  if (subscriptionProduct === 'Paper') {
    if (paperFulfilmentOptions === 'Collection') {
      return 'vouchersubs@theguardian.com';
    }
    return 'homedelivery@theguardian.com';

  }

  if (selectedCountryGroup === 'AUDCountries') {
    return 'apac.help@theguardian.com';
  }

  return 'digitalpack@theguardian.com';
}

Email.defaultProps = {
  email: 'digitalpack@theguardian.com',
};

// ----- Component ----- //

function CustomerService(props: PropTypes) {
  const email = productAndCountrySpecificEmail(
    props.selectedCountryGroup,
    props.subscriptionProduct,
    props.paperFulfilmentOptions,
  );
  switch (props.selectedCountryGroup) {
    case UnitedStates:
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please email <Email email={email} /> or
            call 1-844-632-2010 (toll free); 917-900-4663 (direct line).
            Lines are open 9:15am-6pm, Monday to Friday (EST/EDT).
          </div>
        </div>
      );
    case GBPCountries:
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please email <Email email={email} /> or
            call 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
          </div>
        </div>
      );
    case AUDCountries:
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please
            email <Email email={email} /> or
            call 1800 773 766 (within Australia) or +61 2 8076 8599 (outside Australia).
            Lines are open 9am-5pm Monday-Friday (AEDT).
          </div>
        </div>
      );
    default:
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please email <Email email={email} /> or
            call +44 (0) 330 333 6767. Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
          </div>
        </div>
      );
  }
}

CustomerService.defaultProps = {
  selectedCountryGroup: 'GBPCountries',
  subscriptionProduct: 'DigitalPack',
  paperFulfilmentOptions: null,
};

// ----- Exports ----- //

export default CustomerService;
