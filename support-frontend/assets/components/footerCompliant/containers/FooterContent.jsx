// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
// import { WithMargins } from './WithMargins';
import { Content } from './Content';

type PropTypes = {|
  border: boolean,
  paddingTop: boolean,
  children: Node
|}

function FooterContent({ border, paddingTop, children }: PropTypes) {
  return (
    <div className="component-left-margin-section">
      <div className="component-left-margin-section__content">
        <Content className="component-content__content" border={border} paddingTop={paddingTop}>
          {children}
        </Content>
      </div>
    </div>
  );
}

FooterContent.defaultProps = {
  border: false,
  paddingTop: false,
};

export default FooterContent;
