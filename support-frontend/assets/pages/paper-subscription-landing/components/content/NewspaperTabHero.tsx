import { Accordion } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import FlexContainer from 'components/containers/flexContainer';
import {
	accordionOverride,
	accordionRowOverride,
	copyWidthStyle,
	flexContainerOverride,
	linkStyle,
	paragraphStyle,
} from './NewspaperTabHeroStyles';
import { TabAccordionRow } from './tabAccordionRow';

type HeroDelivery = {
	deliveryTitle: string;
	deliveryInfo: JSX.Element;
};
type HeroContent = {
	productInfo: string[];
	imageUrl: string;
	delivery: HeroDelivery[];
};

const heroContent: Record<PaperFulfilmentOptions, HeroContent> = {
	HomeDelivery: {
		productInfo: [
			'If you want your newspaper delivered to your door, select a subscription below and checkout.',
		],
		imageUrl:
			'https://i.guim.co.uk/img/media/6c9e57a633a20d9c863071dc38dfa24680676cbb/0_0_1011_607/1011.png?width=252&quality=75&s=da12a5fe67381ed9c4243223569d7992',
		delivery: [
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
		productInfo: [
			`Use your Guardian subscription card at 40,000 UK shops with news kiosks, including McColl's, Co-op, One Stop, and select SPAR stores. Collect your paper in-store or arrange delivery through your newsagent.`,
		],
		imageUrl:
			'https://i.guim.co.uk/img/media/e68254bdbeab6806c83d1fb29ec61aef2c376cc1/0_0_892_714/892.jpg?width=222&quality=75&s=00bd5126359c43bfd98829507f846747',
		delivery: [
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
						<div css={linkStyle}>
							<a
								target="_blank"
								href={
									'https://digitalvouchers-production-storefinder.azurewebsites.net/map/go'
								}
							>
								Find your nearest participating store or delivery retailer
							</a>
						</div>
						,
					</>
				),
			},
		],
	},
};

export default function NewspaperTabHero({
	tab,
}: {
	tab: PaperFulfilmentOptions;
}): JSX.Element {
	const homeDeliveryTrackingId = 'Paper_HomeDelivery-tab_Delivery-accordion';
	const { productInfo, imageUrl, delivery: delivery } = heroContent[tab];
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div css={copyWidthStyle}>
				{productInfo.map((paragraph) => (
					<p css={paragraphStyle}>{paragraph}</p>
				))}
				{delivery.map((deliveryItem) => (
					<Accordion cssOverrides={accordionOverride}>
						{[
							<TabAccordionRow
								trackingId={homeDeliveryTrackingId}
								label={deliveryItem.deliveryTitle}
								cssOverrides={accordionRowOverride}
							>
								{deliveryItem.deliveryInfo}
							</TabAccordionRow>,
						]}
					</Accordion>
				))}
			</div>
			<img src={imageUrl} />
		</FlexContainer>
	);
}
