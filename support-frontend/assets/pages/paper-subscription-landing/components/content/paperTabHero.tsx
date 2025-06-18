import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Accordion } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/productCatalog/fulfilmentOptions';
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
		margin: ${space[5]}px;
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
	line-height: 115%;
	padding-bottom: ${space[2]}px;
	${from.tablet} {
		padding-bottom: ${space[3]}px;
		max-width: 669px;
	}
`;
const accordionOverride = css`
	border: none;
	p,
	button {
		color: ${palette.neutral[100]};
	}
`;
const accordionRowOverride = css`
	border: none;
	> button {
		display: flex;
		justify-content: flex-start;
	}
	> button > div > span {
		display: none;
	} // remove label
	> button > div > svg > path {
		fill: ${palette.neutral[100]};
	}
	> div > div > p {
		padding-bottom: ${space[3]}px;
		font-weight: 700;
	}
`;

type HeroContent = {
	productInfo: Array<string | JSX.Element>;
	imageUrl: string;
	deliveryDetails?: JSX.Element;
};
const heroContent: Record<PaperFulfilmentOptions, HeroContent> = {
	HomeDelivery: {
		productInfo: [
			`Use the Guardian’s home delivery service to get our newspaper direct to your door`,
			`Select your subscription below and checkout. You'll receive your first newspaper as quickly as five days from subscribing.`,
		],
		imageUrl: `https://i.guim.co.uk/img/media/6c9e57a633a20d9c863071dc38dfa24680676cbb/0_0_1011_607/1011.png?width=252&quality=75&s=da12a5fe67381ed9c4243223569d7992`,
		deliveryDetails: (
			<>
				<p>Your newspaper will arrive before 9am.</p>
				<p>
					We can’t deliver to individual flats, or apartments within blocks
					because we need access to your post box to deliver your newspaper.
				</p>
				<p>
					You can pause your subscription for up to 5 weeks a year. So if you’re
					going away anywhere, you won’t have to pay for the newspapers that you
					miss.
				</p>
			</>
		),
	},
	Collection: {
		productInfo: [
			`The Guardian subscription card can be used at any of the 40,000 shops and supermarkets with news kiosks in the UK such as McColl's, Co-op, One Stop and selected SPAR stores.`,
			`You can collect the newspaper from your local store or have your copies delivered by your newsagent.`,
			<strong>Collecting from multiple newsagent</strong>,
			<strong>Delivery from your retailer</strong>,
		],
		imageUrl: `https://i.guim.co.uk/img/media/e68254bdbeab6806c83d1fb29ec61aef2c376cc1/0_0_892_714/892.jpg?width=222&quality=75&s=00bd5126359c43bfd98829507f846747`,
		deliveryDetails: undefined,
	},
};

type PaperTabHeroProps = {
	tab: PaperFulfilmentOptions;
};
export function PaperTabHero({ tab }: PaperTabHeroProps): JSX.Element {
	const homeDeliveryTrackingId = 'Paper_HomeDelivery-tab_Delivery-accordion';
	const { productInfo, imageUrl, deliveryDetails } = heroContent[tab];
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div css={copyWidthStyle}>
				{productInfo.map((paragraph) => (
					<p css={paragraphStyle}>{paragraph}</p>
				))}
				{deliveryDetails && (
					<Accordion cssOverrides={accordionOverride}>
						{[
							<TabAccordionRow
								trackingId={homeDeliveryTrackingId}
								label={'View Delivery details'}
								cssOverrides={accordionRowOverride}
							>
								{deliveryDetails}
							</TabAccordionRow>,
						]}
					</Accordion>
				)}
			</div>
			<img src={imageUrl} />
		</FlexContainer>
	);
}
