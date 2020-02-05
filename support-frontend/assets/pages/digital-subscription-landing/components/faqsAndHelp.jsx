// @flow

// ----- Imports ----- //

import * as React from 'react';
import {
  AUDCountries,
  type CountryGroupId,
  GBPCountries,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { type Option } from 'helpers/types/option';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

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

  return 'customer.help@theguardian.com';
}

Email.defaultProps = {
  email: 'customer.help@theguardian.com',
};

// ----- Component ----- //

function FaqsAndHelp(props: PropTypes) {
  const email = productAndCountrySpecificEmail(
    props.selectedCountryGroup,
    props.subscriptionProduct,
    props.paperFulfilmentOptions,
  );

  const Faqs = ({ children }: { children: React.Node }) =>
    (
      <div className="component-customer-service">
        <h2>FAQs and Help</h2>
        <div className="component-customer-service__text">
          {children}
        </div>
      </div>
    );

  switch (props.selectedCountryGroup) {
    case UnitedStates:
      return (
        <Faqs>
          For help with Guardian and Observer subscription services please email <Email email={email} /> or
          call 1-844-632-2010 (toll free); 917-900-4663 (direct line).
          Lines are open 9:15am-6pm, Monday to Friday (EST/EDT).
        </Faqs>
      );
    case GBPCountries:
      return (
        <Faqs>
          For help with Guardian and Observer subscription services please email <Email email={email} /> or
          call 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
        </Faqs>
      );
    case AUDCountries:
      return (
        <Faqs>
          For help with Guardian and Observer subscription services please
          email <Email email={email} /> or
          call 1800 773 766 (within Australia) or +61 2 8076 8599 (outside Australia).
          Lines are open 9am-5pm Monday-Friday (AEDT).
        </Faqs>
      );
    default:
      return (
        <Faqs>
          For help with Guardian and Observer subscription services please email <Email email={email} /> or
          call +44 (0) 330 333 6767. Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
        </Faqs>
      );
  }
}

FaqsAndHelp.defaultProps = {
  selectedCountryGroup: 'GBPCountries',
  subscriptionProduct: 'DigitalPack',
  paperFulfilmentOptions: null,
};

// ----- Exports ----- //

export default FaqsAndHelp;
