// @flow
import React from 'react';
import { connect } from 'react-redux';
import { type State } from '../../contributionsLandingReducer';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import OldContributionThankYou from './old-flow/ContributionThankYouContainer';
import NewContribtuionThankYou from './new-flow/ContributionThankYou';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

type ContributionThankYouProps = {|
  countryGroupId: CountryGroupId,
  shouldShowNewFlow: boolean
|};

const mapStateToProps = (state: State) => ({
  shouldShowNewFlow:
    state.common.abParticipations.newThankYouFlowR1 === 'newFlow',
});

const ContributionThankYou = ({
  countryGroupId,
  shouldShowNewFlow,
}: ContributionThankYouProps) => {
  const oldFlowClassModifiers = ['contribution-thankyou'];

  return (
    <Page
      classModifiers={shouldShowNewFlow ? [] : oldFlowClassModifiers}
      header={<RoundelHeader />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      {shouldShowNewFlow ? (
        <NewContribtuionThankYou />
      ) : (
        <OldContributionThankYou />
      )}
    </Page>
  );
};
export default connect(mapStateToProps)(ContributionThankYou);
