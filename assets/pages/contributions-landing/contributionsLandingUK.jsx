// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import pageStartup from 'helpers/pageStartup';
import { getQueryParameter } from 'helpers/url';
import { setCountry } from 'helpers/internationalisation/country';

import reducer from './reducers/reducers';
import { saveContext } from './helpers/context';
import ContributionsBundleContent from './components/contributionsBundleContent';


// ----- Page Startup ----- //

const participation = pageStartup.start();


// ----- Redux Store ----- //

const country = 'GB';
setCountry(country);

const store = createStore(reducer, {
  intCmp: getQueryParameter('INTCMP'),
  isoCountry: country,
  refpvid: getQueryParameter('REFPVID'),
}, applyMiddleware(thunkMiddleware));

store.dispatch({ type: 'SET_AB_TEST_PARTICIPATION', payload: participation });
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
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('contributions-landing-page-uk'));
