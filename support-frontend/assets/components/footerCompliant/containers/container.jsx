// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { WithMargins, Content } from './containerStyles';

type PropTypes = {|
  border: boolean,
  paddingTop: boolean,
  children: Node
|}

function FooterContainer({ border, paddingTop, children }: PropTypes) {
  return (
    <WithMargins before after>
      <Content border={border} paddingTop={paddingTop}>
        {children}
      </Content>
    </WithMargins>
  );
}

FooterContainer.defaultProps = {
  border: false,
  paddingTop: false,
};

export default FooterContainer;
