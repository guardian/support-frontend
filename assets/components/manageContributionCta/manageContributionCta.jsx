// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import { getBaseDomain } from 'helpers/url';

// ----- Functions ----- //

function buildMMAUrl(): string {
  return `https://profile.${getBaseDomain()}/contribution/recurring/edit`;
}

// ----- Component ----- //

export default function ManageContributionCta() {
  return (
    <div className="component-manage-contribution-cta">
      <CtaLink
        ctaId="manage-contribution"
        text="Update your recurring contribution"
        url={buildMMAUrl()}
        accessibilityHint="Further support the guardian by increasing your regular contribution"
      />
    </div>
  );
}
