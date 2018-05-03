// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';
import QuestionsContact from 'components/questionsContact/questionsContact';

import { routes } from 'helpers/routes';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { contributionsEmail } from 'helpers/legal';
import CirclesIntroduction from "../../components/introduction/circlesIntroduction";
import PageSection from "../../components/pageSection/pageSection";


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //


const content = (
  <div className="gu-content">
    <SimpleHeader />
    <CirclesIntroduction
      headings={['Whoops!']}
    />
    <div className="multiline-divider" />

    <section className="existing gu-content-filler">
      <div className="existing__content gu-content-filler__inner">
        <div className="component-existing-contribution">
            <PageSection modifierClass="existing-contribution">
                <p className="component-existing-contribition__copy">
                    Looks like you are already making a regular contribution to the
                    Guardian - thank you. If you&#39;re feeling generous, there is
                    another way you can&nbsp;help.
                </p>
            </PageSection>
        </div>
        <CtaLink
          ctaId="contribute-one-off-again"
          text="Make a one-off contribution"
          url={routes.oneOffContribCheckout}
          accessibilityHint="Further support the guardian over and above your current regular contribution"
        />
        <QuestionsContact />
      </div>
    </section>
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-existing-page');
