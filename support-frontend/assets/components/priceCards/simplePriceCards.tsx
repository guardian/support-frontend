import { css } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	Button,
	ChoiceCard,
	ChoiceCardGroup,
	SvgChevronDownSingle,
} from '@guardian/source-react-components';
import { useState } from 'react';
import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import { Tooltip } from '../../../stories/content/Tooltip.stories';

const containerCss = css`
	${textSans.medium({ lineHeight: 'tight' })};
`;

const headingCss = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 28px;
		line-height: 115%;
	}
`;

const hrCss = (margin: string) => css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
	margin: ${margin};
	${until.tablet} {
		margin: 14px 0 0;
	}
`;

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
	text-decoration: none;
`;

const iconCss = (flip: boolean) => css`
	svg {
		transition: transform 0.3s ease-in-out;

		${flip && 'transform: rotate(180deg);'}
	}
`;

type Prices = {
	monthly: number;
	annual: number;
};

type PriceSelection = {
	contributionType: RegularContributionType;
	amount: number;
};

export type SimplePriceCardsProps = {
	title: string;
	tagline: string;
	prices: Prices;
	onPriceChange: (priceSelection: PriceSelection) => void;
	countryGroupId: CountryGroupId;
	children: React.ReactNode;
};

export function SimplePriceCards(props: SimplePriceCardsProps): JSX.Element {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div css={containerCss}>
			<h2 css={headingCss}>{props.title}</h2>
			<ChoiceCardGroup name="paymentFrequency" columns={2}>
				<ChoiceCard
					id="monthly"
					key="monthly"
					name="frequency"
					onChange={() =>
						props.onPriceChange({
							contributionType: 'MONTHLY',
							amount: props.prices.monthly,
						})
					}
					checked={false}
					value="monthly"
					label={`${fromCountryGroupId(props.countryGroupId)}${
						props.prices.monthly
					} per month`}
				/>
				<ChoiceCard
					id="annual"
					key="annual"
					name="frequency"
					onChange={() =>
						props.onPriceChange({
							contributionType: 'ANNUAL',
							amount: props.prices.annual,
						})
					}
					checked={false}
					value="annual"
					label={`${fromCountryGroupId(props.countryGroupId)}${
						props.prices.annual
					} per year`}
				/>
			</ChoiceCardGroup>
			<p>{props.tagline}</p>
			<Tooltip promptText="Cancel anytime">
				<p>
					You can cancel
					{props.countryGroupId === 'GBPCountries' ? '' : ' online'} anytime
					before your next payment date. If you cancel in the first 14 days, you
					will receive a full refund.
				</p>
			</Tooltip>
			<hr css={hrCss(`${space[4]}px 0 0`)} />
			<Button
				priority="subdued"
				aria-expanded={showDetails ? 'true' : 'false'}
				onClick={() => setShowDetails(!showDetails)}
				icon={<SvgChevronDownSingle />}
				iconSide="right"
				cssOverrides={[buttonOverrides, iconCss(showDetails)]}
			>
				view details
			</Button>
			{showDetails && <div>{props.children}</div>}
		</div>
	);
}
