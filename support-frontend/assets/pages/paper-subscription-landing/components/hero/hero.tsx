// ----- Imports ----- //
import { css, ThemeProvider } from '@emotion/react';
import {
	between,
	body,
	brandAlt,
	from,
	headline,
	space,
	until,
} from '@guardian/source-foundations';
import {
	buttonThemeBrand,
	LinkButton,
	SvgArrowDownStraight,
} from '@guardian/source-react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import HeroRoundel, { roundelSizeMob } from 'components/page/heroRoundel';
import PageTitle from 'components/page/pageTitle';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperProductPrices';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getDiscountCopy } from './discountCopy';

type PropTypes = {
	productPrices: ProductPrices;
	promotionCopy: PromotionCopy;
};

const fitHeadline = css`
	h1 {
		${between.mobileMedium.and.tablet} {
			max-width: calc(100% - ${roundelSizeMob}px);
		}
	}
`;
const heroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	${from.tablet} {
		padding-bottom: ${space[9]}px;
	}
	${from.desktop} {
		padding-bottom: ${space[24]}px;
	}
`;
const heroTitle = css`
	${headline.medium({
		fontWeight: 'bold',
	})};
	margin-bottom: ${space[3]}px;

	${between.mobileMedium.and.tablet} {
		margin-right: ${roundelSizeMob}px;
	}

	${from.tablet} {
		${headline.large({
			fontWeight: 'bold',
		})};
	}
`;
const heroTitleHighlight = css`
	color: ${brandAlt[400]};
`;
const heroParagraph = css`
	${body.medium({
		lineHeight: 'loose',
	})}
	margin-bottom: ${space[6]}px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}

	${from.desktop} {
		max-width: 75%;
		margin-bottom: ${space[9]}px;
	}
`;
const roundelLines = css`
	padding: ${space[1]}px;
	${headline.xxxsmall({
		fontWeight: 'bold',
	})}
	${from.desktop} {
		${headline.xxsmall({
			fontWeight: 'bold',
		})}
	}
`;
const roundelCentreLine = css`
	${headline.medium({
		fontWeight: 'bold',
	})}
	${from.tablet} {
		${headline.xlarge({
			fontWeight: 'bold',
		})}
	}
`;
const roundelOffset = css`
	${until.tablet} {
		transform: translateY(-34%);
	}
`;
const mobileLineBreak = css`
	${from.tablet} {
		display: none;
	}
`;
const tabletLineBreak = css`
	${from.desktop} {
		display: none;
	}
`;
const defaultTitle = (
	<>
		Guardian <br css={mobileLineBreak} />
		and&nbsp;Observer <br css={mobileLineBreak} />
		newspaper subscriptions <br css={tabletLineBreak} />
		<span css={heroTitleHighlight}>to suit every reader</span>
	</>
);
const defaultCopy = (
	<>
		We offer a range of packages from every day to weekend, and different
		subscription types depending on whether you want to collect your newspaper
		in a shop or get it delivered.
	</>
);

function PaperHero({
	productPrices,
	promotionCopy,
}: PropTypes): JSX.Element | null {
	const maxSavingVsRetail = getMaxSavingVsRetail(productPrices) ?? 0;
	const { roundel } = getDiscountCopy(maxSavingVsRetail);
	const defaultRoundelText = roundel.length ? (
		<>
			{/* role="text" is non-standardised but works in Safari. Ensures the whole section is read as one text element */}
			<div role="text" css={roundelLines}>
				{roundel.map((text, index) => {
					if (index === 1) {
						return <div css={roundelCentreLine}>{text}</div>;
					}

					return text;
				})}
			</div>
		</>
	) : null;

	const title = promotionCopy.title ?? defaultTitle;
	const copy =
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? defaultCopy;
	const roundelText =
		promotionHTML(promotionCopy.roundel) ?? defaultRoundelText;
	return (
		<PageTitle
			title="Newspaper subscription"
			theme="paper"
			cssOverrides={fitHeadline}
		>
			<CentredContainer>
				<Hero
					image={
						<GridImage
							gridId="printCampaignHeroHD"
							srcSizes={[1000, 500, 140]}
							sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
							imgType="png"
							altText="Newspapers"
						/>
					}
					hideRoundelBelow="mobileMedium"
					roundelElement={
						roundelText ? (
							<HeroRoundel cssOverrides={roundelOffset}>
								{roundelText}
							</HeroRoundel>
						) : null
					}
				>
					<section css={heroCopy}>
						<h2 css={heroTitle}>{title}</h2>
						<p css={heroParagraph}>{copy}</p>
						<ThemeProvider theme={buttonThemeBrand}>
							<LinkButton
								onClick={sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'Paper',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								priority="tertiary"
								iconSide="right"
								icon={<SvgArrowDownStraight />}
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
}

export default PaperHero;
