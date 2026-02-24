import GridPicture from 'components/gridPicture/gridPicture';
import HeroHeader from 'components/hero/HeroHeader';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { PaperHeroItems } from '../helpers/PaperHeroCopy';

export default function NewspaperHero({
	paperHeroItems,
	promotionCopy,
}: {
	promotionCopy: PromotionCopy;
	paperHeroItems: PaperHeroItems;
}) {
	const {
		roundel: promotionRoundel,
		title,
		description: promotionDescription,
	} = promotionCopy;

	const {
		titleCopy: fallbackTitle,
		roundelCopy: fallbackRoundel,
		bodyCopy: fallbackDescription,
	} = paperHeroItems;

	const roundel = promotionRoundel ?? fallbackRoundel;
	const description = promotionHTML(promotionDescription, {
		tag: 'p',
	});

	const roundelComponent = roundel && (
		<OfferStrapline copy={roundel} size="small" />
	);

	return (
		<PageTitle title="Newspaper subscription" theme="weekly">
			<HeroHeader
				heroImage={
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
				roundel={roundelComponent}
				title={title ?? fallbackTitle}
				description={description ?? fallbackDescription}
				ctaLink="#HomeDelivery"
				ctaText="See pricing options"
				onClick={sendTrackingEventsOnClick({
					id: 'options_cta_click',
					product: 'Paper',
					componentType: 'ACQUISITIONS_BUTTON',
				})}
			/>
		</PageTitle>
	);
}
