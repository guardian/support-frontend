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

function collectionMapUrl(name: string): JSX.Element {
	return (
		<a
			href={
				'https://digitalvouchers-production-storefinder.azurewebsites.net/map/go'
			}
			target="_blank"
			rel="noopener noreferrer"
		>
			{name}
		</a>
	);
}

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
			'Use the Guardian’s home delivery service to get your newspaper direct to your door.',
		gridPictureImages: gridPictureNewspaperHeroTabImages,
		deliveries: [
			{
				deliveryTitle: 'How our delivery service works',
				deliveryInfo: (
					<>
						<p>Your newspaper will arrive before 9am.</p>
						<p>
							You can pause your subscription for up to 5 weeks a year. So if
							you’re going away anywhere, you won’t have to pay for the
							newspapers that you miss.
						</p>
						<p>
							We can’t deliver to individual flats, or apartments within blocks
							because we need access to your post box to deliver your newspaper.
						</p>
					</>
				),
			},
		],
	},
	Collection: {
		productInfo: `Use your Guardian subscription card to pick up your paper in over 40,000 UK shops with news kiosks, including Co-op, McColl's, One Stop, and select SPAR stores. Or use your card to arrange your own delivery through a local newsagent.`,
		gridPictureImages: gridPictureNewspaperHeroTabImages,
		deliveries: [
			{
				deliveryTitle: 'How to collect in store',
				deliveryInfo: (
					<>
						<p>
							To pick up your paper from multiple newsagents, present your
							Guardian subscription card each time – they’ll scan it and be
							reimbursed automatically.
						</p>
						{collectionMapUrl('Find your nearest participating retailer')}
					</>
				),
			},
			{
				deliveryTitle: 'How to arrange your own delivery',
				deliveryInfo: (
					<>
						<p>
							If you prefer to arrange your own delivery with your local
							retailer, simply share the barcode from your Home Delivery Letter
							with your chosen newsagent. Your retailer will charge you
							separately for delivery. You will receive your Home Delivery
							Letter along with your Guardian subscription card.
						</p>
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
