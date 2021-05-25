// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { Link } from '@guardian/src-link';

import { paperSubsUrl } from 'helpers/urls/routes';

import { type ActiveTabState } from '../../paperSubscriptionLandingPageReducer';
import { setTab } from '../../paperSubscriptionLandingPageActions';

const linkColor = css`
  color: inherit;
`;

function LinkTo({
  setTabAction, tab, children,
}: {|
  setTabAction: typeof setTab,
  tab: ActiveTabState,
  children: Node
|}) {
  return (
    <Link
      css={linkColor}
      href={paperSubsUrl(tab === 'delivery')}
      onClick={(ev) => {
        ev.preventDefault();
        setTabAction(tab);
    }}
    >
      {children}
    </Link>
  );
}

export default LinkTo;
