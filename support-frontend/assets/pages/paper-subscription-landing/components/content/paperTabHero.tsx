import { css } from '@emotion/react';
import { from, space, textSans17, until } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

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
const paragraphStyle = css`
	line-height: 115%;
	padding-bottom: ${space[2]}px;
	${from.tablet} {
		padding-bottom: ${space[3]}px;
		max-width: 669px;
	}
`;

const homeDeliveryImageUrl = `https://i.guim.co.uk/img/media/6c9e57a633a20d9c863071dc38dfa24680676cbb/0_0_1011_607/1011.png?width=252&quality=75&s=da12a5fe67381ed9c4243223569d7992`;
const collectionImageUrl = `https://i.guim.co.uk/img/media/e68254bdbeab6806c83d1fb29ec61aef2c376cc1/0_0_892_714/892.jpg?width=222&quality=75&s=00bd5126359c43bfd98829507f846747`;

type PaperTabHeroProps = {
	tab: PaperFulfilmentOptions;
};
export function PaperTabHero({ tab }: PaperTabHeroProps): JSX.Element {
	const isHomeDelivery = tab === 'HomeDelivery';
	const copyHomeDelivery = [
		`Use the Guardian’s home delivery service to get our newspaper direct to your door`,
		`Select your subscription below and checkout. You'll receive your first newspaper as quickly as five days from subscribing.`,
	];
	const copyCollection = [
		`The Guardian subscription card can be used at any of the 40,000 shops and supermarkets with news kiosks in the UK such as McColl's, Co-op, One Stop and selected SPAR stores.`,
		`You can collect the newspaper from your local store or have your copies delivered by your newsagent.`,
		<strong>Collecting from multiple newsagent</strong>,
		<strong>Delivery from your retailer</strong>,
	];
	const copyHero = isHomeDelivery ? copyHomeDelivery : copyCollection;
	const imgHero = isHomeDelivery ? homeDeliveryImageUrl : collectionImageUrl;
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div>
				{copyHero.map((paragraph) => (
					<p css={paragraphStyle}>{paragraph}</p>
				))}
				{isHomeDelivery && <div>DropDown</div>}
			</div>
			<img src={imgHero} />
		</FlexContainer>
	);
}
