// ----- Imports ----- //
import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headlineBold34,
	headlineBold42,
	palette,
	space,
	textEgyptian17,
	until,
} from '@guardian/source/foundations';
import {
	buttonThemeBrand,
	LinkButton,
	SvgArrowDownStraight,
} from '@guardian/source/react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperSavingsVsRetail';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { offerStraplineBlue } from 'stylesheets/emotion/colours';
import { getDiscountCopy } from './discountCopy';

type PaperHeroPropTypes = {
	promotionCopy: PromotionCopy;
	titleCopy: string | JSX.Element;
	bodyCopy: string;
	roundelCopy?: string | undefined;
};

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
	${headlineBold34};
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		${headlineBold42};
	}
`;
const heroParagraph = css`
	${textEgyptian17};
	line-height: 1.4;
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
const desktopToWideLineBreak = css`
	${until.desktop} {
		display: none;
	}
	${from.wide} {
		display: none;
	}
`;
export const titlePaper = (
	<>
		Guardian and <br css={desktopToWideLineBreak} />
		Observer newspapers
	</>
);
export function titlePaperPlus(productPrices: ProductPrices): string {
	return `Save up to ${
		getMaxSavingVsRetail(productPrices) ?? 0
	}% on your Guardian print subscription`;
}
export function roundelPaper(productPrices: ProductPrices): string | undefined {
	const maxSavingVsRetail = getMaxSavingVsRetail(productPrices) ?? 0;
	const { roundel } = getDiscountCopy(maxSavingVsRetail);
	const roundelText = roundel.length ? roundel.join(' ') : undefined;
	return roundelText;
}
export const roundelPaperPlus = 'Includes unlimited digital access';
export const bodyPaper = `Whether you’re looking to keep up to date with the headlines or pore over
		our irresistible recipes, you can enjoy our award-winning journalism for
		less.`;
export const bodyPaperPlus = `From political insight to the perfect pasta, there’s something for everyone
		with a Guardian print subscription. Plus, enjoy free digital access when you
		subscribe, so you can stay informed on your mobile or tablet, wherever you
		are, whenever you like.`;

export function PaperHero({
	promotionCopy,
	titleCopy,
	bodyCopy,
	roundelCopy,
}: PaperHeroPropTypes): JSX.Element | null {
	const title = promotionCopy.title ?? titleCopy;
	const body =
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? bodyCopy;
	const roundel = promotionCopy.roundel ?? roundelCopy;

	return (
		<PageTitle title="Newspaper subscription" theme="paper">
			<CentredContainer>
				<OfferStrapline
					fgCol={palette.neutral[7]}
					bgCol={offerStraplineBlue}
					copy={roundel}
				/>
				<Hero
					image={
						<GridImage
							gridId="printCampaignWithObserverHeroHD"
							srcSizes={[1000, 500, 140]}
							sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
							imgType="png"
							altText="Newspapers"
						/>
					}
					hideRoundelBelow="mobileMedium"
					roundelElement={undefined}
				>
					<section css={heroCopy}>
						<h2 css={heroTitle}>{title}</h2>
						<p css={heroParagraph}>{body}</p>
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
								href="#HomeDelivery"
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
