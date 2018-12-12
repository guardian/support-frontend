// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';
import SvgGuardianLogo from 'components/svgs/guardianLogo';

import './simpleHeader.scss';

export type PropTypes = {|
  utility: Option<Node>,
|};

// ----- Component ----- //

export default function SimpleHeader({ utility }: PropTypes) {

  return (
    <header className="component-simple-header">
      <div className="component-simple-header__content">
        {utility && <div className="component-simple-header__utility">{utility}</div>}
        <a className="component-simple-header__link" href="https://www.theguardian.com">
          <div className="accessibility-hint">The guardian logo</div>
          <SvgGuardianLogo />
        </a>
      </div>
    </header>
  );

}
SimpleHeader.defaultProps = {
  utility: null,
};
