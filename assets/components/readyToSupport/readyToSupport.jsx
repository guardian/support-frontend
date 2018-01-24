// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import { SvgChevronUp } from 'components/svg/svg';


// ----- Props ----- //

type PropTypes = {
  ctaUrl: string,
};


// ----- Component ----- //

export default function ReadyToSupport(props: PropTypes) {

  return (
    <section className="component-ready-to-support">
      <div className="component-ready-to-support__content gu-content-margin">
        <h1 className="component-ready-to-support__heading">
          <span className="component-ready-to-support__heading-line">Ready to support</span>
          <span className="component-ready-to-support__heading-line">The&nbsp;Guardian?</span>
        </h1>
        <CtaLink
          text="See supporter options"
          url={props.ctaUrl}
          ctaId="see-supporter-options"
          accessibilityHint="See the options for becoming a supporter"
          svg={<SvgChevronUp />}
        />
      </div>
    </section>
  );

}
