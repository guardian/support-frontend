import React from 'react';
import PageSection from 'components/pageSection/pageSection';
import SubscribeCta from 'components/subscribeCta/subscribeCta';
import ContributeCta from 'components/contributeCta/ContributeCta';

export default function WaysToSupport() {
  return (
    <PageSection heading="Ways to support">
      <SubscribeCta />
      <ContributeCta />
    </PageSection>
  );
}
