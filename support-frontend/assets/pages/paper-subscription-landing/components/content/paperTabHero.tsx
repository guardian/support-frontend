import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

const flexContainerOverride = css`
	${textSans17};
	background-color: ${palette.brand[600]};
	align-items: flex-start;
	justify-content: space-between;

	margin: ${space[3]}px ${space[2]}px ${space[5]}px;
	padding: ${space[2]}px ${space[3]}px ${space[3]}px;
	border-radius: ${space[1]}px;
	${from.desktop} {
		margin: ${space[5]}px;
		padding: ${space[3]}px ${space[5]}px;
		border-radius: ${space[2]}px;
	}

	img {
		${until.desktop} {
			display: none;
		}
	}
`;
const paragraphStyle = css`
	line-height: 165%;
`;

type PaperTabHeroProps = {
	tab: PaperFulfilmentOptions;
};
export function PaperTabHero({ tab }: PaperTabHeroProps): JSX.Element {
	const copyHomeDelivery = [
		`Use the Guardian’s home delivery service to get our newspaper direct`,
		`Select your subscription below and checkout. You'll receive your first newspaper as quickly as five days from subscribing.`,
	];
	const copyCollection = [
		`The Guardian subscription card can be used at any of the 40,000 shops and supermarkets with news kiosks in the UK such as McColl's, Co-op, One Stop and selected SPAR stores.`,
		`You can collect the newspaper from your local store or have your copies delivered by your newsagent.`,
		<strong>Collecting from multiple newsagent</strong>,
		<strong>Delivery from your retailer</strong>,
	];
	const copy = tab === 'HomeDelivery' ? copyHomeDelivery : copyCollection;
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div>
				{copy.map((paragraph) => (
					<p css={paragraphStyle}>{paragraph}</p>
				))}
				{tab === 'HomeDelivery' && <div>DropDown</div>}
			</div>
			<div>Image</div>
		</FlexContainer>
	);
}
