import React from "react";
import Page from "components/page/page";
import Footer from "components/footer/footer";
import { RoundelHeader } from "components/headers/roundelHeader/header";
import ContributionThankYou from "./ContributionThankYou";
import type { CountryGroupId } from "helpers/internationalisation/countryGroup";
import "helpers/internationalisation/countryGroup";
type ContributionThankYouProps = {
  countryGroupId: CountryGroupId;
};

const ContributionThankYouPage = ({
  countryGroupId
}: ContributionThankYouProps) => <Page classModifiers={['contribution-thankyou']} header={<RoundelHeader />} footer={<Footer disclaimer countryGroupId={countryGroupId} />}>
    <ContributionThankYou />
  </Page>;

export default ContributionThankYouPage;