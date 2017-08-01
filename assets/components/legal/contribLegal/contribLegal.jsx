// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function ContribLegal() {

  return (
    <div className="component-contrib-legal">
      <p className="component-contrib-legal__text">
        The ultimate owner of the Guardian is The Scott Trust Limited,
        whose role it is to secure the editorial and financial independence
        of the Guardian in perpetuity. Reader contributions support the
        Guardian’s journalism.&nbsp;
      </p>
      <p className="component-contrib-legal__text">
        Please note that your support of the Guardian’s journalism does not
        constitute a charitable donation, as such your contribution is not
        eligible for Gift Aid in the UK nor a tax-deduction elsewhere.&nbsp;
      </p>
      <p className="component-contrib-legal__text">
        If you have any questions about contributing to the Guardian,
        please <a href="mailto:contribution.support@theguardian.com">
        contact us here</a>.&nbsp;
      </p>
    </div>
  );

}
