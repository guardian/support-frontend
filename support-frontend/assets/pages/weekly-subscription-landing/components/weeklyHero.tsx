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
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import { promotionHTML } from 'helpers/productPrice/promotions';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { guardianWeeklyHeroBlue } from 'stylesheets/emotion/colours';

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
const weeklyShowOnMobile = css`
	display: block;
	${from.mobileLandscape} {
		display: none;
	}
`;
const linkButtonColour = css`
	color: ${palette.neutral[7]};
`;
const containerHero = (enableWeeklyDigital: boolean) => css`
	background-color: ${enableWeeklyDigital
		? palette.neutral[100]
		: guardianWeeklyHeroBlue};
	margin-bottom: ${enableWeeklyDigital ? space[8] : 0}px;
`;
const strapLineColour = (enableWeeklyDigital: boolean) => css`
	background-color: ${enableWeeklyDigital
		? palette.brand[800]
		: palette.brandAlt[400]};
`;

const getRegionalCopyFor = (region: CountryGroupId): JSX.Element => {
	return region === GBPCountries ? (
		<span>
			Find clarity
			<br css={weeklyShowOnMobile} /> with the Guardian&apos;s global magazine
		</span>
	) : (
		<span>
			Read The
			<br css={weeklyShowOnMobile} /> Guardian in print
		</span>
	);
};

const getFirstParagraph = (
	promotionCopy: PromotionCopy,
	orderIsAGift: boolean,
): JSX.Element | null => {
	if (promotionCopy.description) {
		return promotionHTML(promotionCopy.description);
	}

	if (orderIsAGift) {
		return (
			<>
				<p>
					Gift the Guardian Weekly magazine to someone today, so they can gain a
					deeper understanding of the issues they care about. They’ll find
					in-depth reporting, alongside news, opinion pieces and long reads from
					around the globe. From unpicking the election results to debunking
					climate misinformation, they can take time with the Guardian Weekly to
					help them make sense of the world.
				</p>
			</>
		);
	}

	return (
		<>
			The Guardian Weekly takes you beyond the headlines to give you a deeper
			understanding of the issues that really matter. Inside you’ll find the
			week’s most memorable stories brought to life with striking photography.
			Featuring a roundup of global news, opinion and long reads, all handpicked
			from the Guardian and Observer.
		</>
	);
};

type WeeklyHeroProps = {
	orderIsAGift: boolean;
	promotionCopy: PromotionCopy;
	countryGroupId: CountryGroupId;
	enableWeeklyDigital: boolean;
};
export function WeeklyHero({
	orderIsAGift,
	promotionCopy,
	countryGroupId,
	enableWeeklyDigital,
}: WeeklyHeroProps): JSX.Element {
	const defaultRoundelText = 'Save up to 35% a year';
	const defaultTitle = orderIsAGift ? null : getRegionalCopyFor(countryGroupId);
	const title = promotionCopy.title ?? defaultTitle;
	const copy = getFirstParagraph(promotionCopy, orderIsAGift);
	const roundelText = promotionCopy.roundel ?? defaultRoundelText;
	return (
		<PageTitle
			title={orderIsAGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
			theme="weekly"
		>
			<CentredContainer>
				{!orderIsAGift && (
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
