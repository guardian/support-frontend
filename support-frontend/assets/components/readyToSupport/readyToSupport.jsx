// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import SvgChevronUp from 'components/svgs/chevronUp';
import Heading, { type HeadingSize } from 'components/heading/heading';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

// ----- Props ----- //

type PropTypes = {|
  ctaUrl: string,
  headingSize: HeadingSize,
  context: string,
|};


// ----- Component ----- //

export default function ReadyToSupport(props: PropTypes) {

  return (
    <section className="component-ready-to-support">
      <div className="component-ready-to-support__content">
        <Heading size={props.headingSize} className="component-ready-to-support__heading">
          <span className="component-ready-to-support__heading-line">Ready to support</span>
          <span className="component-ready-to-support__heading-line">The&nbsp;Guardian?</span>
        </Heading>
        <CtaLink
          text="See supporter options"
          url={props.ctaUrl}
          accessibilityHint="See the options for becoming a supporter"
          svg={<SvgChevronUp />}
          modifierClasses={['see-supporter-options']}
          onClick={sendClickedEvent(props.context.concat('-supporter_options_cta'))}
        />
      </div>
    </section>
  );

}


ReadyToSupport.defaultProps = {
  context: 'component-ready-to-support',
};
