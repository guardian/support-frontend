// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	article17,
	from,
	headlineBold28,
	headlineBold34,
	palette,
	space,
} from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowDownStraight,
	themeButtonBrandAlt,
} from '@guardian/source/react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { PaperHeroItems } from '../helpers/PaperHeroCopy';

const heroCssOverrides = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
	flex-direction: column-reverse;
`;

const heroCopy = css`
	padding: ${space[1]}px ${space[5]}px ${space[10]}px;
`;

const heroTitle = css`
	${headlineBold28};
	margin-bottom: ${space[3]}px;

	${from.desktop} {
		${headlineBold34};
	}
`;

const heroParagraph = css`
	${article17};
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

export default function NewspaperHero({
	paperHeroItems,
	promotionCopy,
}: {
	promotionCopy: PromotionCopy;
	paperHeroItems: PaperHeroItems;
}) {
	const title = promotionCopy.title ?? paperHeroItems.titleCopy;
	const body =
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? paperHeroItems.bodyCopy;
	const roundel = promotionCopy.roundel ?? paperHeroItems.roundelCopy;

	return (
		<PageTitle title="Newspaper subscription" theme="weekly">
			<CentredContainer>
				{roundel && <OfferStrapline copy={roundel} size="small" />}
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
					hideRoundelBelow="mobileMedium"
					cssOverrides={heroCssOverrides}
				>
					<section css={heroCopy}>
						<h2 css={heroTitle}>{title}</h2>
						<p css={heroParagraph}>{body}</p>
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
							theme={themeButtonBrandAlt}
						>
							See pricing options
						</LinkButton>
					</section>
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
}
