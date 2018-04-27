// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import SquaresIntroduction from 'components/introduction/squaresIntroduction';
import PageSection from 'components/pageSection/pageSection';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Types ----- //

type PropTypes = {
  errorCode: string,
  headings: string[],
  copy: string,
};


// ----- Component ----- //

export default function ErrorContent(props: PropTypes) {

  return (
    <div className="component-error-content gu-content">
      <SimpleHeader />
      <SquaresIntroduction
        headings={props.headings}
        highlights={[`Error ${props.errorCode}`]}
      />
      <PageSection modifierClass="ctas">
        <p className="error-copy">{props.copy}</p>
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

}
