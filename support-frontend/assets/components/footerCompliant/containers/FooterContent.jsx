// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { WithMargins } from './WithMargins';
import { Content } from './Content';

type PropTypes = {|
  border: boolean,
  paddingTop: boolean,
  children: Node
|}

function FooterContent({ border, paddingTop, children }: PropTypes) {
  return (
    <WithMargins before after>
      <Content border={border} paddingTop={paddingTop}>
        {children}
      </Content>
    </WithMargins>
  );
}

FooterContent.defaultProps = {
  border: false,
  paddingTop: false,
};

export default FooterContent;
