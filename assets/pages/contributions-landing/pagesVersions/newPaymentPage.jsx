// @flow

// ----- Imports ----- //

import * as React from 'react';
import { Provider } from 'react-redux';
import type { Store } from 'redux';

import { type CountryGroupId /*, countryGroups */ } from 'helpers/internationalisation/countryGroup';
// import { getOrigin } from 'helpers/url';
import Page from 'components/page/page';

// React components connected to redux store

// Page-specific react components connected to redux store


// ----- Types ----- //

type PropTypes = {
  store: Store<*, *, *>,
  countryGroupId: CountryGroupId
};

// ----- Internationalisation ----- //

const defaultHeaderCopy = 'Help us deliver the independent journalism the world needs';
const defaultContributeCopy = `
  Make a monthly commitment to support The Guardian long term or a one-off contribution 
  as and when you feel like it – choose the option that suits you best.
`;

const countryGroupSpecificDetails: {
  [CountryGroupId]: {headerCopy: string, contributeCopy: string}
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  AUDCountries: {
    headerCopy: 'Help us deliver the independent journalism Australia needs',
    contributeCopy: defaultContributeCopy,
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
};

// function payPalCancelUrl(cgId: CountryGroupId): string {
//   return `${getOrigin()}/${countryGroups[cgId].supportInternationalisationId}/contribute`;
// }


// ----- Render ----- //

const NewPaymentPage: (PropTypes) => React.Node = (props: PropTypes) =>
  (
    <Provider store={props.store}>
      <Page header={<header />} footer={<footer />}>
        <h1>{countryGroupSpecificDetails[props.countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[props.countryGroupId].contributeCopy}</p>
      </Page>
    </Provider>
  );

export default NewPaymentPage;
