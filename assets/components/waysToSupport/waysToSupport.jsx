import React from 'react';
import PageSection from 'components/pageSection/pageSection';
import SubscribeCta from 'components/subscribeCta/subscribeCta';
import ContributeCta from 'components/contributeCta/ContributeCta';

type PropTypes = {|
  id: ?string,
|};


export default function WaysToSupport(props: PropTypes) {
  return (
    <div id={props.id}>
      <PageSection heading="Ways to support">
        <SubscribeCta />
        <ContributeCta />
      </PageSection>
    </div>
  );
}

WaysToSupport.defaultProps = {
  id: null
};
