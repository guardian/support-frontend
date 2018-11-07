// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import SvgChevronUp from 'components/svgs/chevronUp';
import Heading, { type HeadingSize } from 'components/heading/heading';
import OptimizeExperimentWrapper from 'components/optimizeExperimentWrapper/optimizeExperimentWrapper';

// ----- Props ----- //

type PropTypes = {|
  ctaUrl: string,
  headingSize: HeadingSize,
|};


// ----- Component ----- //

export default function ReadyToSupport(props: PropTypes) {

  return (
    <section className="component-ready-to-support">
      <div className="component-ready-to-support__content">
        <Heading size={props.headingSize} className="component-ready-to-support__heading">
          <OptimizeExperimentWrapper experimentId="81Tbhi0zQtWVzCykCoNTHA">
            {/* Original */}
            <span className="component-ready-to-support__heading-line">Ready to support</span>
            {/* Variant */}
            <span className="component-ready-to-support__heading-line">Not ready to support</span>
          </OptimizeExperimentWrapper>
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
