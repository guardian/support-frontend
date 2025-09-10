import {
	LinkButton,
	SvgArrowDownStraight,
	themeButtonBrandAlt,
} from '@guardian/source/react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridPicture from 'components/gridPicture/gridPicture';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { PaperHeroItems } from '../helpers/PaperHeroCopy';
import {
	heroCopy,
	heroCssOverrides,
	heroParagraph,
	heroTitle,
} from './NewspaperHeroStyles';

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
						<GridPicture
							sources={[
								{
									gridId: 'newspaperLandingHeroMobile',
									srcSizes: [2000, 1000, 500],
									sizes: '414px',
									imgType: 'png',
									media: '(max-width: 739px)',
								},
								{
									gridId: 'newspaperLandingHeroTablet',
									srcSizes: [1000, 500],
									sizes: '320px',
									imgType: 'png',
									media: '(max-width: 979px)',
								},
								{
									gridId: 'newspaperLandingHeroDesktop',
									srcSizes: [2000, 1000, 500],
									sizes: '422px',
									imgType: 'png',
									media: '(min-width: 980px)',
								},
							]}
							fallback="newspaperLandingHeroDesktop"
							fallbackSize={422}
							altText=""
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
