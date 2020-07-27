// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { WithMargins, Content } from './containerStyles';

type PropTypes = {|
  leftBorder: boolean,
  children: Node
|}

function FooterContainer({ leftBorder, children }: PropTypes) {
  return (
    <WithMargins before after>
      <Content leftBorder={leftBorder}>
        {children}
      </Content>
    </WithMargins>
  );
}

FooterContainer.defaultProps = {
  leftBorder: false,
};

export default FooterContainer;
