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
	themeButtonBrandAlt,
} from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { guardianWeeklyHeroBlue } from 'stylesheets/emotion/colours';
import { getFirstParagraph, getRegionalCopyFor } from './contentHelpers';

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
const containerHero = (enableWeeklyDigital: boolean) => css`
	background-color: ${enableWeeklyDigital
		? palette.neutral[100]
		: guardianWeeklyHeroBlue};
	margin-bottom: 0;
	${from.desktop} {
		margin-bottom: ${enableWeeklyDigital ? space[8] : 0}px;
	}
`;
const strapLineColour = (enableWeeklyDigital: boolean) => css`
	background-color: ${enableWeeklyDigital
		? palette.brand[800]
		: palette.brandAlt[400]};
`;

type WeeklyHeroProps = {
	isGift: boolean;
	promotionCopy: PromotionCopy;
	countryGroupId: CountryGroupId;
	enableWeeklyDigital: boolean;
};
export function WeeklyHero({
	isGift,
	promotionCopy,
	countryGroupId,
	enableWeeklyDigital,
}: WeeklyHeroProps): JSX.Element {
	const defaultRoundelText = 'Save up to 35% a year';
	const defaultTitle = isGift ? null : getRegionalCopyFor(countryGroupId);
	const title = promotionCopy.title ?? defaultTitle;
	const copy = getFirstParagraph(promotionCopy, isGift);
	const roundelText = promotionCopy.roundel ?? defaultRoundelText;
	return (
		<PageTitle
			title={isGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
			theme="weekly"
		>
			<CentredContainer>
				{!isGift && (
					<OfferStrapline
						copy={roundelText}
						cssOverrides={strapLineColour(enableWeeklyDigital)}
					/>
				)}
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
					cssOverrides={containerHero(enableWeeklyDigital)}
				>
					<section css={weeklyHeroCopy}>
						<h2 css={weeklyHeroTitle}>{title}</h2>
						<p css={weeklyHeroParagraph}>{copy}</p>
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
							theme={enableWeeklyDigital ? themeButtonBrandAlt : themeButton}
						>
							See pricing options
						</LinkButton>
					</section>
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
}
