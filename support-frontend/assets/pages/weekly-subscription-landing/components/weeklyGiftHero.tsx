import {
	LinkButton,
	SvgArrowDownStraight,
	themeButton,
} from '@guardian/source/react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import HeroContainer from 'components/hero/HeroContainer';
import { PageTitle } from 'components/page/pageTitle';
import {
	type PromotionCopy,
	promotionHTML,
} from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
	containerHero,
	linkButtonColour,
	weeklyGiftHeroCopy,
	weeklyGiftHeroParagraph,
	weeklyGiftHeroTitle,
} from './weeklyGiftHeroStyles';

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
						<section css={weeklyGiftHeroCopy}>
							<h2 css={weeklyGiftHeroTitle}>{promotionCopy.title ?? ''}</h2>
							<div css={weeklyGiftHeroParagraph}>
								{getFirstParagraph(promotionCopy)}
							</div>
							<LinkButton
								onClick={sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'GuardianWeekly',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								priority="tertiary"
								iconSide="right"
								icon={<SvgArrowDownStraight />}
								href="#subscribe"
								cssOverrides={linkButtonColour}
								theme={themeButton}
							>
								See pricing options
							</LinkButton>
						</section>
					}
					cssOverrides={containerHero}
				/>
			</CentredContainer>
		</PageTitle>
	);
}
