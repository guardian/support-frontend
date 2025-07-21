import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Accordion } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import FlexContainer from 'components/containers/flexContainer';
import { TabAccordionRow } from './tabAccordionRow';

const flexContainerOverride = css`
	${textSans17};
	background-color: #335182;
	align-items: flex-start;
	justify-content: space-between;

	margin: ${space[3]}px ${space[2]}px ${space[5]}px;
	padding: ${space[2]}px ${space[3]}px ${space[3]}px;
	border-radius: ${space[1]}px;
	${from.tablet} {
		margin: ${space[6]}px;
		padding: ${space[3]}px ${space[5]}px;
		border-radius: ${space[2]}px;
	}

	img {
		object-fit: cover;
		${until.tablet} {
			display: none;
		}
	}
`;
const copyWidthStyle = css`
	color: ${palette.neutral[100]};
	${from.tablet} {
		max-width: 669px;
	}
`;
const paragraphStyle = css`
	text-align: justify;
	line-height: 115%;
	padding-bottom: ${space[2]}px;
	${from.tablet} {
		padding-bottom: ${space[4]}px;
		max-width: 669px;
	}
`;
const accordionOverride = css`
	border-top: 1px solid ${neutral[73]};
	border-bottom: none;
	p,
	button {
		color: ${palette.neutral[100]};
	}
`;
const accordionRowOverride = css`
	border: none;
	> button {
		display: flex;
	}
	> button > div > span {
		display: none;
	} // remove label
	> button > div > svg > path {
		fill: ${palette.neutral[100]};
	}
	> div > div > p {
		padding-bottom: ${space[2]}px;
	}
`;
const linkStyle = css`
	& a {
		color: ${neutral[100]};
		:visited {
			color: ${neutral[100]};
		}
	}
`;

type HeroDelivery = {
	title: string;
	content: JSX.Element;
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
				title: 'Delivery details',
				content: (
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
				title: 'Collecting from multiple newsagents',
				content: (
					<p>
						To collect from multiple newsagents, present your card each time –
						they’ll scan it and be reimbursed automatically.
					</p>
				),
			},
			{
				title: 'Delivery from your retailer',
				content: (
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
								label={deliveryItem.title}
								cssOverrides={accordionRowOverride}
							>
								{deliveryItem.content}
							</TabAccordionRow>,
						]}
					</Accordion>
				))}
			</div>
			<img src={imageUrl} />
		</FlexContainer>
	);
}
