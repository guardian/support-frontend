// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import OptimizeExperimentWrapper from 'components/optimizeExperimentWrapper/optimizeExperimentWrapper';

// ----- Component ----- //

const experimentId = '222';

function CtaAbTestWrapper({ children }: {children: Node}) {

  return (
    <OptimizeExperimentWrapper experimentId={experimentId}>
      {children}
    </OptimizeExperimentWrapper>
  );

}


// ----- Exports ----- //

export default CtaAbTestWrapper;
