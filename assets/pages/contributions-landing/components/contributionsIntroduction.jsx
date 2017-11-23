// @flow

// ----- Imports ----- //

import React from 'react';
import type { Participations } from 'helpers/abTests/abtest';

// ----- Componenent ----- //
type PropTypes = {
  abTests: Participations,
}

function getSubtitle(abTests: Participations) {
  if (abTests.usRecurringCopyTest === 'subtitle') {
    return (
      <div>
        <p className="contributions-introduction__upsell">
          Contributing to the Guardian makes a big impact. If you’re able,
          please consider <strong>monthly</strong> support – it will help to fund our
          journalism for the long term.
        </p>
      </div>
    );
  }
  return (
    <div className="contributions-introduction__secondary">
      <h1>support the&nbsp;Guardian </h1>
      <h1><span className="contributions-introduction__indent">make a contribution </span></h1>
    </div>
  );
}

export default function ContributionsIntroduction(props: PropTypes) {
  return (
    <div className="contributions-introduction">
      <div className="contributions-introduction__primary">
        <h1>help us deliver</h1>
        <h1>the independent journalism</h1>
        <h1>the world needs</h1>
      </div>

      {getSubtitle(props.abTests)}
    </div>
  );

}
