// @flow

// ----- Imports ----- //

import * as React from 'react';
import { Provider } from 'react-redux';
import type { Store } from 'redux';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import Footer from 'components/footer/footer';
import Contribute from 'components/contribute/contribute';

// React components connected to redux store
import CountrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';

// Page-specific react components connected to redux store
import ContributionSelectionContainer from '../containers/contributionSelectionContainer';
import ContributionPaymentCtasContainer from '../containers/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from '../containers/payPalContributionButtonContainer';
import ContributionAwarePaymentLogosContainer from '../containers/contributionAwarePaymentLogosContainer';


// ----- Types ----- //

type PropTypes = {
  store: Store<*, *, *>,
  countryGroupId: CountryGroupId,
};


// ----- Internationalisation ----- //

const defaultHeaderCopy = ['Help us deliver the', 'independent journalism', 'the world needs'];
const defaultContributeCopy = 'Make a monthly commitment to support The Guardian long term or a one-off contribution as and when you feel like it – choose the option that suits you best.';

const usContributeCopy = 'Make a monthly commitment to support The Guardian long term or a one-time contribution as and when you feel like it – choose the option that suits you best.';

const countryGroupSpecificDetails: {
  [CountryGroupId]: {headerCopy: string[], contributeCopy: string}
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
    contributeCopy: usContributeCopy,
  },
  AUDCountries: {
    headerCopy: ['Help us deliver', 'the independent', 'journalism', 'Australia needs'],
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

const CountrySwitcherHeader = CountrySwitcherHeaderContainer(
  '/contribute',
  ['GBPCountries', 'UnitedStates', 'EURCountries', 'NZDCountries', 'Canada', 'International', 'AUDCountries'],
);


// ----- Render ----- //

const HorizontalLayoutLandingPage: (PropTypes) => React.Node = (props: PropTypes) => (
  <Provider store={props.store}>
    <Page
      header={<CountrySwitcherHeader />}
      footer={<Footer disclaimer />}
    >
      <CirclesIntroduction
        headings={countryGroupSpecificDetails[props.countryGroupId].headerCopy}
        highlights={['Your contribution']}
        modifierClasses={['compact']}
      />
      <Contribute
        copy={countryGroupSpecificDetails[props.countryGroupId].contributeCopy}
        modifierClasses={['compact']}
      >
        <ContributionSelectionContainer />
        <ContributionAwarePaymentLogosContainer />
        <ContributionPaymentCtasContainer
          PayPalButton={PayPalContributionButtonContainer}
        />
      </Contribute>
    </Page>
  </Provider>
);

export default HorizontalLayoutLandingPage;
