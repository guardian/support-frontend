// @flow

// ----- Imports ----- //

import * as React from 'react';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type Option } from 'helpers/types/option';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { AUDCountries, GBPCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { promotionTermsUrl } from 'helpers/externalLinks';

// ----- Props ----- //

type PropTypes = {|
  selectedCountryGroup: CountryGroupId,
  subscriptionProduct: SubscriptionProduct,
  paperFulfilmentOptions: Option<PaperFulfilmentOptions>,
  promoCode?: Option<string>,
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
  const promotionTerms = props.promoCode ?
    (
      <div>
        <h2>Promotion terms and conditions</h2>
        <div className="component-customer-service__text">
          <p>
            Offer subject to availability. Guardian News and Media Limited (&quot;GNM&quot;)
            reserves the right to withdraw this promotion at any time.
            For full promotion terms and conditions see <a href={promotionTermsUrl(props.promoCode)}>here</a>
          </p>
        </div>
      </div>
    )
    : null;


  const Faqs = ({ children }: { children: React.Node }) =>
    (
      <div className="component-customer-service">
        {promotionTerms}
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

CustomerService.defaultProps = {
  selectedCountryGroup: 'GBPCountries',
  subscriptionProduct: 'DigitalPack',
  paperFulfilmentOptions: null,
  promoCode: null,
};

// ----- Exports ----- //

export default CustomerService;
