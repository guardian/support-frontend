// @flow

// ----- Imports ----- //

import * as React from 'react';

import { Provider } from 'react-redux';
import type { Store } from 'redux';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


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
  [CountryGroupId]: {headerCopy: string[], contributeCopy: string, reactElementId: string}
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-uk',
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-eu',
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: usContributeCopy,
    reactElementId: 'contributions-landing-page-us',
  },
  AUDCountries: {
    headerCopy: ['Help us deliver', 'the independent', 'journalism', 'Australia needs'],
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-au',
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-int',
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-nz',
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-ca',
  },
};

const CountrySwitcherHeader = CountrySwitcherHeaderContainer(
  '/contribute',
  ['GBPCountries', 'UnitedStates', 'EURCountries', 'NZDCountries', 'Canada', 'International', 'AUDCountries'],
);


// ----- Render ----- //

const HorizontalLayoutLandingPage: (PropTypes) => React.Node = (props: PropTypes) => {
  const dropIntroTextTestVariant = props.store && props.store.getState().common.abParticipations.dropIntroText;
  const copyText = dropIntroTextTestVariant === 'variant' ? '' : countryGroupSpecificDetails[props.countryGroupId].contributeCopy;


  return (
    <Provider store={props.store}>
      <div className="gu-content">
        <CountrySwitcherHeader />
        <CirclesIntroduction
          headings={countryGroupSpecificDetails[props.countryGroupId].headerCopy}
          highlights={['Your contribution']}
          modifierClasses={['compact']}
        />
        <Contribute
          copy={copyText}
          modifierClasses={['compact']}
        >
          <ContributionSelectionContainer />
          <ContributionAwarePaymentLogosContainer />
          <ContributionPaymentCtasContainer
            PayPalButton={PayPalContributionButtonContainer}
          />
        </Contribute>
        <Footer disclaimer />
      </div>
    </Provider>
  );
};

export default HorizontalLayoutLandingPage;
