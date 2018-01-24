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
      <div className="component-ready-to-support__content">
        <h1 className="component-ready-to-support__heading">
          Ready to support The&nbsp;Guardian
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
