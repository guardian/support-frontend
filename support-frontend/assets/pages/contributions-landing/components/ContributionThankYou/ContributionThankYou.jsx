// @flow
import React from 'react';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import NewContributionThankYou from './new-flow/ContributionThankYou';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

type ContributionThankYouProps = {|
  countryGroupId: CountryGroupId,
|};

const ContributionThankYou = ({
  countryGroupId,
}: ContributionThankYouProps) => (
  <Page
    header={<RoundelHeader />}
    footer={<Footer disclaimer countryGroupId={countryGroupId} />}
  >
    <NewContributionThankYou />
  </Page>
);
export default ContributionThankYou;
