// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';
import QuestionsContact from 'components/questionsContact/questionsContact';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { getBaseDomain } from 'helpers/url';

import CirclesIntroduction from '../../components/introduction/circlesIntroduction';
import PageSection from '../../components/pageSection/pageSection';

// ----- Functions ----- //

function buildMMAUrl(): string {
  return `https://profile.${getBaseDomain()}/contribution/recurring/edit`;
}

// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <CirclesIntroduction
      headings={['Whoops!']}
    />
    <PageSection modifierClass="existing-contribution">
      <p className="existing-contribition-copy">
          It looks like you are already making a regular financial
          contribution to the Guardian - thank you! If you would like to
          help fund our journalism further, you can increase the amount
          you give via your account. It only takes two minutes,
          and it makes a world of difference.
      </p>
      <div className="manage-contribution-cta">
        <CtaLink
          ctaId="manage-contribution"
          text="Amend your recurring contribution"
          url={buildMMAUrl()}
          accessibilityHint="Further support the guardian by increasing your regular contribution"
        />
      </div>
    </PageSection>
    <QuestionsContact />
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-existing-page');
