// @flow
import React from 'react';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgShare from './components/SvgShare';
import ShareableArticleContainer from "./components/ShareableArticleContainer";

type PropTypes = { header: String, body: String }

const ContributionThankYouArticleShare = (props: PropTypes) => {
  const actionIcon = <SvgShare />;
  const actionHeader = <ActionHeader title={props.header} />;
  const actionBody = (
    <ActionBody>
      <p>{props.body}</p>
      <ShareableArticleContainer
        articleURL="https://www.theguardian.com/environment/ng-interactive/2019/oct/16/the-guardians-climate-pledge-2019"
        headline="The Guardian's climate pledge 2019"
        linkedImageUrl=""
      />
      <ShareableArticleContainer
        articleURL="https://www.theguardian.com/environment/2019/oct/16/guardian-language-changes-climate-environment"
        headline="'It's a crisis, not a change': the six Guardian language changes on climate matters"
        linkedImageUrl=""
      />
      <ShareableArticleContainer
        articleURL="https://www.theguardian.com/environment/2019/oct/17/climate-science-deniers-environment-warning"
        headline"'There are no excuses left': why climate science deniers are running out of rope"
        linkedImageUrl="https://i.guim.co.uk/img/media/9c8c38800c02d2ffcee2c65485f1c9859d9c41a7/3_195_2445_1467/master/2445.jpg"
      />
    </ActionBody>
  );

  return (
    <ActionContainer
      icon={actionIcon}
      header={actionHeader}
      body={actionBody}
    />
  );
};

export default ContributionThankYouArticleShare;
