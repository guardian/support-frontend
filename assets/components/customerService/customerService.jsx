// @flow

// ----- Imports ----- //

import React from 'react';

import {
  countryGroups,
  stringToCountryGroupId,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import type { SelectOption } from 'components/selectInput/selectInput';
import { privacyLink, copyrightNotice } from 'helpers/legal';



// ----- Props ----- //

type PropTypes = {
  selectedCountryGroup: CountryGroupId,
};

// ----- Functions ----- //

// just make this an object
function customerServiceText(country: CountryGroupId): string {
  switch (country) { //todo FAQ link & where should this text really live?
    case 'UnitedStates': return "For help with Guardian and Observer subscription services please email digitalpack@theguardian.com or call 1-844-632-2010 (toll free); 917-900-4663 (direct line). Lines are open 9:15am-6pm, Monday to Friday (EST/EDT).  You may also find help in our Frequently Asked Questions. ";
    case 'GBPCountries': return "For help with Guardian and Observer subscription services please email digitalpack@theguardian.com or call 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).  You may also find help in our Frequently Asked Questions. ";
    default: return "For help with Guardian and Observer subscription services please email digitalpack@theguardian.com or call +44 (0) 330 333 6767. Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).  You may also find help in our Frequently Asked Questions. ";
  }
}

// ----- Component ----- //

function CustomerService(props: PropTypes) {

  return (
    <div className="component-footer__customer-service-text">
      {customerServiceText(props.selectedCountryGroup)}
    </div>
  );
}


// ----- Exports ----- //

export default CustomerService;
