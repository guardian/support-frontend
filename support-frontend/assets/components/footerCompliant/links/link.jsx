// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { link } from './linkStyles';

type PropTypes = {|
  href: string,
  children: Node
|}

function FooterLink({ href, children }: PropTypes) {
  return (
    <li css={link}>
      <a href={href}>{children}</a>
    </li>
  );
}

export default FooterLink;
