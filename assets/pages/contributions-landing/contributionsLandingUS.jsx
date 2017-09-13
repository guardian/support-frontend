// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import ContribLegal from 'components/legal/contribLegal/contribLegal';

import { init as pageInit } from 'helpers/page/page';

import reducer from './reducers/reducers';
import { saveContext } from './helpers/context';
import ContributionsBundleContent from './components/contributionsBundleContent';


// ----- Redux Store ----- //
const store = pageInit(reducer, {
  common: { isoCountry: 'US' },
}, applyMiddleware(thunkMiddleware));

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

ReactDOM.render(content, document.getElementById('contributions-landing-page-us'));
