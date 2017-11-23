// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';
import InfoSection from 'components/infoSection/infoSection';

import { routes } from 'helpers/routes';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="existing gu-content-filler">
      <div className="existing__content gu-content-filler__inner">
        <div className="existing__wrapper">
          <h1 className="existing__heading">Whoops!</h1>
          <h2 className="existing__subheading">
            Looks like you are already making a regular contribution to the
            Guardian - thank you. If you&#39;re feeling generous, there is
            another way you can&nbsp;help.
          </h2>
          <CtaLink
            ctaId="contribute-one-off-again"
            text="Make a one-off contribution"
            url={routes.oneOffContribCheckout}
            accessibilityHint="Further support the guardian over and above your current regular contribution"
          />
        </div>
        <InfoSection heading="Questions?" className="existing__questions">
          <p>
            If you have any questions about contributing to the Guardian,
            please <a href="mailto:contribution.support@theguardian.com">contact us</a>
          </p>
        </InfoSection>
      </div>
    </section>
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-existing-page');
