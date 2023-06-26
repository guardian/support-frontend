import { css } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source-foundations';
import {
	Button,
	ChoiceCard,
	ChoiceCardGroup,
	SvgChevronDownSingle,
} from '@guardian/source-react-components';
import { useState } from 'react';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	fromCountryGroupId,
	glyph,
} from 'helpers/internationalisation/currency';

const containerCss = css`
	${textSans.medium({ lineHeight: 'tight' })};
`;

const headingCss = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		${headline.small({ fontWeight: 'bold' })}
		font-size: 28px;
		line-height: 115%;
	}
`;

const headingSubtitle = css`
	color: ${palette.brand[500]};
`;

const cardsContainer = css`
	margin: ${space[4]}px 0 ${space[3]}px 0;
	${from.tablet} {
		margin: ${space[5]}px 0 ${space[4]}px 0;
	}
`;

const boldText = css`
	font-weight: 700;
`;

const hrCss = css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
	margin: 14px -${space[3]}px ${space[3]}px;
	${from.tablet} {
		margin: ${space[4]}px -${space[5]}px ${space[3]}px;
	}

	${from.desktop} {
		margin: ${space[4]}px -${space[6]}px ${space[3]}px;
	}
`;

const buttonOverrides = css`
	width: 100%;
	min-height: unset;
	height: min-content;
	justify-content: center;
	text-decoration: none;
	${textSans.xsmall()};
	color: ${palette.neutral[20]};
`;

const iconCss = (flip: boolean) => css`
	svg {
		max-width: ${space[3]}px;
		transition: transform 0.3s ease-in-out;

		${flip && 'transform: rotate(180deg);'}
	}
`;

const detailsSection = css`
	display: flex;
	flex-direction: column-reverse;
`;

const detailsContainer = css`
	margin-bottom: ${space[3]}px;
`;

type Prices = {
	MONTHLY: number;
	ANNUAL: number;
};

type PriceSelection = {
	contributionType: RegularContributionType;
	amount: number;
};

export type SimplePriceCardsProps = {
	title: string;
	subtitle: string;
	prices: Prices;
	onPriceChange: (priceSelection: PriceSelection) => void;
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	children: React.ReactNode;
};

function getLabel(
	countryGroupId: CountryGroupId,
	prices: Prices,
	contributionType: ContributionType,
) {
	const currencyGlyph = glyph(fromCountryGroupId(countryGroupId));
	if (contributionType === 'ANNUAL') {
		return (
			<span>
				{currencyGlyph}
				{prices.ANNUAL}/year
			</span>
		);
	}
	return (
		<span>
			{currencyGlyph}
			{prices.MONTHLY}/month
		</span>
	);
}

function getTaglinePrice(
	countryGroupId: CountryGroupId,
	prices: Prices,
	contributionType: ContributionType,
) {
	const period = contributionType === 'ANNUAL' ? 'year' : 'month';
	const price = contributionType === 'ANNUAL' ? prices.ANNUAL : prices.MONTHLY;

	return `${glyph(fromCountryGroupId(countryGroupId))}${price} per ${period}`;
}

export function SimplePriceCards(props: SimplePriceCardsProps): JSX.Element {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div css={containerCss}>
			<h2 css={headingCss}>
				{props.title} <span css={headingSubtitle}>{props.subtitle}</span>
			</h2>
			<ChoiceCardGroup name="paymentFrequency" columns={2} css={cardsContainer}>
				<ChoiceCard
					id="annual"
					key="annual"
					name="frequency"
					onChange={() =>
						props.onPriceChange({
							contributionType: 'ANNUAL',
							amount: props.prices.ANNUAL,
						})
					}
					checked={props.contributionType === 'ANNUAL'}
					value="annual"
					label={getLabel(props.countryGroupId, props.prices, 'ANNUAL')}
				/>
				<ChoiceCard
					id="monthly"
					key="monthly"
					name="frequency"
					onChange={() =>
						props.onPriceChange({
							contributionType: 'MONTHLY',
							amount: props.prices.MONTHLY,
						})
					}
					checked={props.contributionType === 'MONTHLY'}
					value="monthly"
					label={getLabel(props.countryGroupId, props.prices, 'MONTHLY')}
				/>
			</ChoiceCardGroup>
			<p>
				You will fund fearless, independent journalism for{' '}
				<strong css={boldText}>
					{getTaglinePrice(
						props.countryGroupId,
						props.prices,
						props.contributionType,
					)}
					. Cancel or change anytime.
				</strong>
			</p>
			<hr css={hrCss} />
			<div css={detailsSection}>
				<Button
					priority="subdued"
					aria-expanded={showDetails ? 'true' : 'false'}
					onClick={() => setShowDetails(!showDetails)}
					icon={<SvgChevronDownSingle />}
					iconSide="right"
					cssOverrides={[buttonOverrides, iconCss(showDetails)]}
				>
					{showDetails ? 'Hide details' : 'View details'}
				</Button>
				{showDetails && <div css={detailsContainer}>{props.children}</div>}
			</div>
		</div>
	);
}
