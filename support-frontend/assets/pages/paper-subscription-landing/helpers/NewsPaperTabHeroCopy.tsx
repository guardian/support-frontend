import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';

type HeroDelivery = {
	deliveryTitle: string;
	deliveryInfo: JSX.Element;
};
type HeroContent = {
	productInfo: string;
	gridPictureImages: GridPictureProp;
	deliveries: HeroDelivery[];
};

const gridPictureNewspaperHeroTabImages: GridPictureProp = {
	sources: [
		{
			gridId: 'guardianWeeklyTabHeroMobile',
			srcSizes: [271, 542],
			sizes: '271px',
			imgType: 'jpg',
			media: '(max-width: 659px)',
		},
		{
			gridId: 'guardianWeeklyTabHeroPhablet',
			srcSizes: [331, 662],
			sizes: '331px',
			imgType: 'jpg',
			media: '(max-width: 739px)',
		},
		{
			gridId: 'guardianWeeklyTabHeroMobile',
			srcSizes: [271, 542],
			sizes: '271px',
			imgType: 'jpg',
			media: '(max-width: 979px)',
		},
		{
			gridId: 'guardianWeeklyTabHeroDesktop',
			srcSizes: [342, 684],
			sizes: '342px',
			imgType: 'jpg',
			media: '(min-width: 980px)',
		},
	],
	fallback: 'guardianWeeklyTabHeroDesktop',
	fallbackSize: 342,
	altText: 'Guardian Weekly Tab Hero',
	fallbackImgType: 'jpg',
};

const heroContent: Record<PaperFulfilmentOptions, HeroContent> = {
	HomeDelivery: {
		productInfo:
			'If you want your newspaper delivered to your door, select a subscription below and checkout.',
		gridPictureImages: gridPictureNewspaperHeroTabImages,
		deliveries: [
			{
				deliveryTitle: 'Delivery details',
				deliveryInfo: (
					<>
						<p>Your newspaper will arrive before 9am.</p>
						<p>
							We can’t deliver to individual flats, or apartments within blocks
							because we need access to your post box to deliver your newspaper.
						</p>
						<p>
							You can pause your subscription for up to 5 weeks a year. So if
							you’re going away anywhere, you won’t have to pay for the
							newspapers that you miss.
						</p>
					</>
				),
			},
		],
	},
	Collection: {
		productInfo: `Use your Guardian subscription card at 40,000 UK shops with news kiosks, including McColl's, Co-op, One Stop, and select SPAR stores. Collect your paper in-store or arrange delivery through your newsagent.`,
		gridPictureImages: gridPictureNewspaperHeroTabImages,
		deliveries: [
			{
				deliveryTitle: 'Collecting from multiple newsagents',
				deliveryInfo: (
					<p>
						To collect from multiple newsagents, present your card each time –
						they’ll scan it and be reimbursed automatically.
					</p>
				),
			},
			{
				deliveryTitle: 'Delivery from your retailer',
				deliveryInfo: (
					<>
						<p>
							To arrange your own delivery with your local retailer, share the
							barcode from your Home Delivery Letter with your chosen store.{' '}
						</p>
						<a
							target="_blank"
							href={
								'https://digitalvouchers-production-storefinder.azurewebsites.net/map/go'
							}
						>
							Find your nearest participating store or delivery retailer
						</a>
						,
					</>
				),
			},
		],
	},
};

export function getHeroContent(
	fulfilmentOption: PaperFulfilmentOptions,
): HeroContent {
	return heroContent[fulfilmentOption];
}
