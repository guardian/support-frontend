// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import Contribute from 'components/contribute/contribute';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import type { CommonState } from 'helpers/page/page';

import pageReducer from './contributionsLandingUKReducer';
import ContributionSelectionContainer from './components/contributionSelectionContainer';

import type { PageState } from './contributionsLandingUKReducer';


// ----- Types ----- //

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  pageReducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <CirclesIntroduction
        headings={['Help us deliver', 'the independent', 'journalism the', 'world needs']}
        highlights={['Support', 'The Guardian']}
      />
      <Contribute>
        <ContributionSelectionContainer />
      </Contribute>
      <Footer />
    </div>
  </Provider>
);

renderPage(content, 'contributions-landing-page-uk');
