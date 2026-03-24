import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold42,
	palette,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';
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
import { guardianWeeklyHeroBlue } from 'stylesheets/emotion/colours';
import { getFirstParagraph } from './contentHelpers';

const weeklyHeroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	color: ${palette.neutral[7]};
`;
const weeklyHeroTitle = css`
	${headlineBold28};
	margin-bottom: ${space[3]}px;
	${from.mobileLandscape} {
		width: 75%;
	}
	${from.tablet} {
		${headlineBold42};
		width: 100%;
	}
`;
const weeklyHeroParagraph = css`
	${textEgyptian17};
	margin-bottom: ${space[9]}px;
	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}
`;

const linkButtonColour = css`
	color: ${palette.neutral[7]};
`;
const containerHero = () => css`
	background-color: ${guardianWeeklyHeroBlue};
	margin-bottom: 0;
	${from.desktop} {
		margin-bottom: 0px;
	}
`;

export function WeeklyHero({
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
					cssOverrides={containerHero()}
				>
					<section css={weeklyHeroCopy}>
						<h2 css={weeklyHeroTitle}>{promotionCopy.title}</h2>
						<p css={weeklyHeroParagraph}>{getFirstParagraph(promotionCopy)}</p>
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
