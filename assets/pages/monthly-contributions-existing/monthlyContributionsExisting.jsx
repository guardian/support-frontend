// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import CtaLink from 'components/ctaLink/ctaLink';
import InfoSection from 'components/infoSection/infoSection';

import pageStartup from 'helpers/pageStartup';


// ----- Page Startup ----- //

pageStartup.start();


// ----- Render ----- //

const content = (
  <div>
    <SimpleHeader />
    <section className="existing">
      <div className="existing__content gu-content-margin">
        <div className="existing__wrapper">
          <h1 className="existing__heading">Existing Contributor</h1>
          <h2 className="existing__subheading">
            You&#39;re already making a vital monthly contribution that will help
            us maintain our independent, investigative journalism
          </h2>
          <CtaLink
            text="One-off contribution"
            url="https://contribute.theguardian.com"
          />
          <InfoSection heading="Questions?" className="existing__questions">
            <p>
              If you have any questions about contributing to the Guardian,
              please <a href="mailto:contribution.support@theguardian.com">
              contact us</a>
            </p>
          </InfoSection>
        </div>
      </div>
    </section>
    <SimpleFooter />
  </div>
);

ReactDOM.render(
  content,
  document.getElementById('monthly-contributions-existing-page'),
);
