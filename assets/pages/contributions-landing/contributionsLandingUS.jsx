// @flow

// ----- Imports ----- //

import React from 'react';
import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import LinksFooter from 'components/footers/linksFooter/linksFooter';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import reducer from './contributionsLandingReducers';
import { saveContext } from './helpers/context';
import ContributionsBundleContent from './components/contributionsBundleContent';


// ----- Page Startup ----- //

const store = pageInit(reducer, undefined, applyMiddleware(thunkMiddleware));

saveContext(store.dispatch);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <section className="contributions-bundle">
        <ContributionsBundleContent />
      </section>
      <section className="contributions-legal gu-content-filler">
        <div className="contributions-legal__content gu-content-filler__inner">
          <ContribLegal />
        </div>
      </section>
      <LinksFooter />
    </div>
  </Provider>
);

renderPage(content, 'contributions-landing-page-us');
