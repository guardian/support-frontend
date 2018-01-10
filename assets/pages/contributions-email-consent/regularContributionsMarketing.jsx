// @flow

// ----- Imports ----- //

import React from 'react';

import * as user from 'helpers/user/user';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { routes } from '../../helpers/routes';


// ----- Page Startup ----- //

pageInit();


const onClick = () => {
  console.log("here");
  return fetch(routes.recurringContributionsSendMarketing()).then(response => {
    console.log(response);
    window.location.assign(routes.recurringContribThankyou);
  });
};

user.init(store.dispatch);
// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="thankyou gu-content-filler">
      <div className="thankyou__content gu-content-filler__inner">
        <div className="thankyou__wrapper">
          <h1 className="thankyou__heading">We would like to hear from you</h1>
          <h2 id="qa-thank-you-message" className="thankyou__subheading">
            <p>Some copy around supporting the guardian
            </p>
          </h2>
          <CtaLink
            onClick={onClick}
            ctaId="next"
            text="next"
            accessibilityHint="Go to the guardian dot com front page"
          />
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-marketing');
