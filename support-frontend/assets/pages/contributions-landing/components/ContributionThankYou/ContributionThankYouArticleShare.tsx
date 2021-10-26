import React, { useEffect, useState } from 'preact/compat';
import { catchPromiseHandler } from 'helpers/utilities/promise';
import ActionBody from './components/ActionBody';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import ShareableArticleContainer from './components/ShareableArticleContainer';
import SvgShare from './components/SvgShare';

type SharableArticle = {
	articleUrl: string;
	headline: string;
	image: {
		imageUrl: string;
		altText: string;
	};
};

const ContributionThankYouArticleShare: React.FC = () => {
	const [articleData, setArticleData] = useState<SharableArticle[] | null>(
		null,
	);

	const header = 'Share Guardian journalism';
	const copy =
		'Help extend the reach of our environmental reporting by sharing it with your friends, family and followers.';

	useEffect(() => {
		fetch('/thank-you-shareable-articles')
			.then((response) => response.json())
			.then((data) => setArticleData(data as SharableArticle[]))
			.catch(catchPromiseHandler('Error fetching shareable articles'));
	}, []);

	const actionIcon = <SvgShare />;
	const actionHeader = <ActionHeader title={header} />;
	const actionBody = (
		<ActionBody>
			<p>{copy}</p>
			{articleData?.map((article) => (
				<ShareableArticleContainer
					key={article.articleUrl}
					articleUrl={article.articleUrl}
					headline={article.headline}
					imageUrl={article.image.imageUrl}
					imageAltText={article.image.altText}
				/>
			))}
		</ActionBody>
	);
	const actionContainer = (
		<ActionContainer
			icon={actionIcon}
			header={actionHeader}
			body={actionBody}
		/>
	);
	return articleData && actionContainer;
};

export default ContributionThankYouArticleShare;
