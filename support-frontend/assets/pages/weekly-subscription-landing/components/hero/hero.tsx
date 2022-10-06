// ----- Imports ----- //

import { css, ThemeProvider } from '@emotion/react';
import {
	body,
	brandAlt,
	from,
	headline,
	space,
	text,
} from '@guardian/source-foundations';
import {
	buttonThemeDefault,
	LinkButton,
	SvgArrowDownStraight,
} from '@guardian/source-react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import PageTitle from 'components/page/pageTitle';
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	detect,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import { promotionHTML } from 'helpers/productPrice/promotions';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { guardianWeeklyHeroBlue } from 'stylesheets/emotion/colours';

type PropTypes = {
	orderIsAGift: boolean;
	countryGroupId: CountryGroupId;
	promotionCopy: PromotionCopy;
	participations: Participations;
};
const weeklyHeroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	color: ${text.primary};
`;
const weeklyHeroTitle = css`
	${headline.small({
		fontWeight: 'bold',
	})};
	margin-bottom: ${space[3]}px;

	${from.mobileLandscape} {
		width: 75%;
	}

	${from.tablet} {
		${headline.large({
			fontWeight: 'bold',
		})};
		width: 100%;
	}
`;
const weeklyHeroParagraph = css`
	${body.medium({
		lineHeight: 'loose',
	})}
	margin-bottom: ${space[9]}px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}
`;
const showOnMobile = css`
	display: block;

	${from.mobileLandscape} {
		display: none;
	}
`;

const getRegionalCopyFor = (region: CountryGroupId) =>
	region === GBPCountries ? (
		<span>
			Find clarity
			<br css={showOnMobile} /> with the Guardian&apos;s global magazine
		</span>
	) : (
		<span>
			Read The
			<br css={showOnMobile} /> Guardian in print
		</span>
	);

const getFirstParagraph = (
	promotionCopy: PromotionCopy,
	orderIsAGift: boolean,
) => {
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

const WeeklyHero: React.FC<PropTypes> = ({ orderIsAGift, promotionCopy }) => {
	const defaultRoundelText = 'Save up to 35% a year';
	const defaultTitle = orderIsAGift ? null : getRegionalCopyFor(detect());
	const title = promotionCopy.title ?? defaultTitle;
	const copy = getFirstParagraph(promotionCopy, orderIsAGift);
	const roundelText = promotionCopy.roundel ?? defaultRoundelText;
	const containerColour = css`
		background-color: ${guardianWeeklyHeroBlue};
	`;
	const linkButtonColour = css`
		color: ${text.primary};
		&:hover {
			background: ${'#AEBDC8'};
		}
	`;

	return (
		<PageTitle
			title={orderIsAGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
			theme="weekly"
		>
			<CentredContainer>
				<OfferStrapline
					fgCol={text.primary}
					bgCol={brandAlt[400]}
					copy={roundelText}
					orderIsAGift={orderIsAGift}
				/>
				<Hero
					image={
						<GridImage
							gridId="weeklyCampaignHeroImg"
							srcSizes={[1000, 500, 140]}
							sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
							imgType="png"
							altText="A collection of Guardian Weekly magazines"
						/>
					}
					roundelText={undefined}
					cssOverrides={containerColour}
				>
					<section css={weeklyHeroCopy}>
						<h2 css={weeklyHeroTitle}>{title}</h2>
						<p css={weeklyHeroParagraph}>{copy}</p>
						<ThemeProvider theme={buttonThemeDefault}>
							<LinkButton
								onClick={sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'GuardianWeekly',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								priority="tertiary"
								iconSide="right"
								icon={<SvgArrowDownStraight />}
								cssOverrides={linkButtonColour}
								href="#subscribe"
							>
								See pricing options
							</LinkButton>
						</ThemeProvider>
					</section>
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
};

export { WeeklyHero };
