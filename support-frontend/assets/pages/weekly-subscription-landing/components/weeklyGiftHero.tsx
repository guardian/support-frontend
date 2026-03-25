import {
	LinkButton,
	SvgArrowDownStraight,
	themeButton,
} from '@guardian/source/react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getFirstParagraph } from './contentHelpers';
import {
	containerHero,
	linkButtonColour,
	weeklyGiftHeroCopy,
	weeklyGiftHeroParagraph,
	weeklyGiftHeroTitle,
} from './weeklyGiftHeroStyles';

export function WeeklyGiftHero({
	promotionCopy,
}: {
	promotionCopy: PromotionCopy;
}): JSX.Element {
	return (
		<PageTitle title={'Give the Guardian Weekly'} theme="weekly">
			<CentredContainer>
				<Hero
					image={
						<GridImage
							gridId="weeklyCampaignHeroImg"
							srcSizes={[500, 140]}
							sizes="(max-width: 740px) 100%, 500px"
							imgType="png"
							altText="A collection of Guardian Weekly magazines"
						/>
					}
					roundelText={undefined}
					cssOverrides={containerHero}
				>
					<section css={weeklyGiftHeroCopy}>
						<h2 css={weeklyGiftHeroTitle}>{promotionCopy.title}</h2>
						<p css={weeklyGiftHeroParagraph}>
							{getFirstParagraph(promotionCopy)}
						</p>
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
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
}
