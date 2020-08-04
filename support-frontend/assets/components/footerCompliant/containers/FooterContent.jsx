// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
// import { WithMargins } from './WithMargins';
import { Content } from './Content';

type PropTypes = {|
  centred?: boolean,
  border?: boolean,
  paddingTop?: boolean,
  children: Node
|}

function FooterContent({
  centred, border, paddingTop, children,
}: PropTypes) {
  return (
    <div className="component-left-margin-section">
      <div className="component-left-margin-section__content">
        <Content className="component-content__content" centred={centred} border={border} paddingTop={paddingTop}>
          {children}
        </Content>
      </div>
    </div>
  );
}

FooterContent.defaultProps = {
  centred: false,
  border: false,
  paddingTop: false,
};

export default FooterContent;
