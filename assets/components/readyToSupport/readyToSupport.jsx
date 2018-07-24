// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import SvgChevronUp from 'components/svgs/chevronUp';
import Heading  from 'components/heading/heading';

// ----- Props ----- //

type PropTypes = {
  ctaUrl: string,
};


// ----- Component ----- //

export default function ReadyToSupport(props: PropTypes) {

  return (
    <section className="component-ready-to-support">
      <div className="component-ready-to-support__content">
        <Heading size={3} className="component-ready-to-support__heading">
          <span className="component-ready-to-support__heading-line">Ready to support</span>
          <span className="component-ready-to-support__heading-line">The&nbsp;Guardian?</span>
        </Heading>
        <CtaLink
          text="See supporter options"
          url={props.ctaUrl}
          accessibilityHint="See the options for becoming a supporter"
          svg={<SvgChevronUp />}
          modifierClasses={['see-supporter-options']}
        />
      </div>
    </section>
  );

}
