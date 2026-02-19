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
	const title = promotionCopy.title ?? paperHeroItems.titleCopy;
	const description =
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? paperHeroItems.bodyCopy;
	const roundel = (
		<OfferStrapline
			copy={promotionCopy.roundel ?? paperHeroItems.roundelCopy ?? ''}
			size="small"
		/>
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
				roundel={roundel}
				title={title}
				description={description}
				ctaLink='"#HomeDelivery'
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
