import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import HeroContainer from 'components/hero/HeroContainer';
import HeroContent from 'components/hero/HeroContent';
import { PageTitle } from 'components/page/pageTitle';
import {
	type PromotionCopy,
	promotionHTML,
} from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { containerHero } from './weeklyGiftHeroStyles';

const getFirstParagraph = (promotionCopy: PromotionCopy): JSX.Element => {
	const defaultParagraph = (
		<p>
			Gift the Guardian Weekly magazine to someone today, so they can gain a
			deeper understanding of the issues they care about. They’ll find in-depth
			reporting, alongside news, opinion pieces and long reads from around the
			globe. From unpicking the election results to debunking climate
			misinformation, they can take time with the Guardian Weekly to help them
			make sense of the world.
		</p>
	);
	return (
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? defaultParagraph
	);
};

export function WeeklyGiftHero({
	promotionCopy,
}: {
	promotionCopy: PromotionCopy;
}): JSX.Element {
	const { title = '' } = promotionCopy;
	const description = getFirstParagraph(promotionCopy);

	return (
		<PageTitle title={'Give the Guardian Weekly'} theme="weekly">
			<CentredContainer>
				<HeroContainer
					imageSlot={
						<GridImage
							gridId="weeklyCampaignHeroImg"
							srcSizes={[500, 140]}
							sizes="(max-width: 740px) 100%, 500px"
							imgType="png"
							altText="A collection of Guardian Weekly magazines"
						/>
					}
					contentSlot={
						<HeroContent
							title={title}
							description={description}
							ctaText="See pricing options"
							ctaLink="#subscribe"
							onClick={() =>
								sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'GuardianWeekly',
									componentType: 'ACQUISITIONS_BUTTON',
								})
							}
						/>
					}
					cssOverrides={containerHero}
				/>
			</CentredContainer>
		</PageTitle>
	);
}
