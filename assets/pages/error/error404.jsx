// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import SquaresIntroduction from 'components/introduction/squaresIntroduction';
import PageSection from 'components/pageSection/pageSection';
import CtaLink from 'components/ctaLink/ctaLink';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <SquaresIntroduction
      headings={['the page you', 'have requested', 'does not exist']}
      highlights={['Error 404']}
    />
    <PageSection modifierClass="ctas">
      <div className="error-copy">
        <p>You may have followed an outdated link, or have mistyped a URL.</p>
        <p>If you believe this to be an error, please report it.</p>
      </div>
      <CtaLink
        text="Support The Guardian"
        accessibilityHint="click here to support The Guardian"
        ctaId="support-the-guardian"
        url="/"
      />
      <CtaLink
        text="Go to The Guardian home page"
        accessibilityHint="click here to return to The Guardian home page"
        ctaId="guardian-home-page"
        url="https://www.theguardian.com"
      />
    </PageSection>
    <Footer />
  </div>
);

renderPage(content, 'error-404-page');
