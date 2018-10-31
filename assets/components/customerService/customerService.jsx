// @flow

// ----- Imports ----- //

import React from 'react';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Props ----- //

type PropTypes = {|
  selectedCountryGroup: CountryGroupId,
|};

// ----- Functions ----- //

function DigitalPackEmail(props: { email: string }) {
  return (
    <a className="component-customer-service__digital-pack-email" href={`mailto:${props.email}`}>
      {props.email}
    </a>
  );
}

DigitalPackEmail.defaultProps = {
  email: 'digitalpack@theguardian.com',
};

// ----- Component ----- //

function CustomerService(props: PropTypes) {
  switch (props.selectedCountryGroup) {
    case 'UnitedStates':
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please email <DigitalPackEmail /> or
            call 1-844-632-2010 (toll free); 917-900-4663 (direct line).
            Lines are open 9:15am-6pm, Monday to Friday (EST/EDT).
          </div>
        </div>
      );
    case 'GBPCountries':
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please email <DigitalPackEmail /> or
            call 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
          </div>
        </div>
      );
    case 'AUDCountries':
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please
            email <DigitalPackEmail email="apac.help@theguardian.com" /> or
            call 1800 773 766 (within Australia) or +61 2 8076 8599 (outside Australia).
            Lines are open 9am-5pm Monday-Friday (AEDT)
          </div>
        </div>
      );
    default:
      return (
        <div className="component-customer-service">
          <div className="component-customer-service__text">
            For help with Guardian and Observer subscription services please email <DigitalPackEmail /> or
            call +44 (0) 330 333 6767. Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
          </div>
        </div>
      );
  }
}


// ----- Exports ----- //

export default CustomerService;
