// @flow
// $FlowIgnore - required for hooks
import React, { useEffect, useState } from 'preact/compat';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ActionBody from './components/ActionBody';
import SvgShare from './components/SvgShare';
import ShareableArticleContainer from './components/ShareableArticleContainer';

type PropTypes = { header: string, body: string }

const ContributionThankYouArticleShare = (props: PropTypes) => {
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    fetch('/thank-you-shareable-articles')
      .then(response => response.json())
      .then(data => setArticleData(data));
  }, []);

  const actionIcon = <SvgShare />;
  const actionHeader = <ActionHeader title={props.header} />;
  const actionBody = (
    <ActionBody>
      <p>{props.body}</p>
      {articleData && articleData.map(article => (<ShareableArticleContainer
        articleUrl={article.articleUrl}
        headline={article.headline}
        imageUrl={article.image.imageUrl}
        imageAltText={article.image.altText}
      />))}
    </ActionBody>
  );
  const actionContainer = (
    <ActionContainer
      icon={actionIcon}
      header={actionHeader}
      body={actionBody}
    />
  );

  return (
    articleData && actionContainer
  );
};

export default ContributionThankYouArticleShare;
