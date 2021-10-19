// @ts-ignore - required for hooks
import React, { useEffect, useState } from "preact/compat";
import ActionContainer from "./components/ActionContainer";
import ActionHeader from "./components/ActionHeader";
import ActionBody from "./components/ActionBody";
import SvgShare from "./components/SvgShare";
import ShareableArticleContainer from "./components/ShareableArticleContainer";

const ContributionThankYouArticleShare = () => {
  const [articleData, setArticleData] = useState(null);
  const header = 'Share Guardian journalism';
  const copy = 'Help extend the reach of our environmental reporting by sharing it with your friends, family and followers.';
  useEffect(() => {
    fetch('/thank-you-shareable-articles').then(response => response.json()).then(data => setArticleData(data));
  }, []);
  const actionIcon = <SvgShare />;
  const actionHeader = <ActionHeader title={header} />;
  const actionBody = <ActionBody>
      <p>{copy}</p>
      {articleData && articleData.map(article => <ShareableArticleContainer key={article.articleUrl} articleUrl={article.articleUrl} headline={article.headline} imageUrl={article.image.imageUrl} imageAltText={article.image.altText} />)}
    </ActionBody>;
  const actionContainer = <ActionContainer icon={actionIcon} header={actionHeader} body={actionBody} />;
  return articleData && actionContainer;
};

export default ContributionThankYouArticleShare;