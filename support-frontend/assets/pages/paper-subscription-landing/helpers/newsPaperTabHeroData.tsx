import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';

type HeroDelivery = {
	deliveryTitle: string;
	deliveryInfo: JSX.Element;
};
type HeroContent = {
	productInfo: string;
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

const heroContent: Record<PaperFulfilmentOptions, HeroContent> = {
	HomeDelivery: {
		productInfo:
			'Use the Guardian’s home delivery service to get your newspaper direct to your door.',
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
							separately for delivery, and you can manage your deliveries with
							them directly. You will receive your Home Delivery Letter along
							with your Guardian subscription card.
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
