// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { linksList } from './linkStyles';

type PropTypes = {|
  children: Node
|}

function FooterLinksList({ children }: PropTypes) {
  return (
    <ul css={linksList}>
      {children}
    </ul>
  );
}


export default FooterLinksList;
