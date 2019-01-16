// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import OptimizeExperimentWrapper from 'components/optimizeExperimentWrapper/optimizeExperimentWrapper';

// ----- Component ----- //

const experimentId = '12244652354235';

function CtaAbTestWrapper({ children }: {children: Node}) {

  return (
    <OptimizeExperimentWrapper experimentId={experimentId}>
      {children}
    </OptimizeExperimentWrapper>
  );

}


// ----- Exports ----- //

export default CtaAbTestWrapper;
