import { css } from '@emotion/react';
import {
	background,
	body,
	border,
	culture,
	from,
	headline,
	lifestyle,
	news,
	space,
	textSans,
} from '@guardian/source-foundations';
import BlockLabel from 'components/blockLabel/blockLabel';
import { SvgTicket } from 'components/icons/ticket';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import EventCard from './eventCard';
import {
	felicityCloakeImage,
	keirStarmerImage,
	woleSoyinkaImage,
} from './eventsImages';

const container = css`
	box-sizing: border-box;
	width: 100%;
	background-color: ${background.primary};
`;
const label = css`
	position: absolute;
	left: 0;
	top: -27px;

	${from.tablet} {
		top: -31px;
	}

	${from.desktop} {
		top: -35px;
	}
`;
const contentContainer = css`
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: ${space[3]}px;
	padding-bottom: ${space[4]}px;

	${from.tablet} {
		display: inline-flex;
		flex-direction: row;
		justify-content: space-between;
		border: solid 1px ${border.secondary};
	}
`;
const textContentContainer = css`
	width: 100%;

	${from.tablet} {
		width: 50%;
	}

	${from.desktop} {
		width: 53%;
	}

	${from.leftCol} {
		width: 55%;
	}
`;
const cardTitle = css`
	${headline.xxsmall({
		fontWeight: 'bold',
	})};
	line-height: 115%;

	${from.tablet} {
		${headline.xsmall({
			fontWeight: 'bold',
		})};
		/* Overriding font-size to match the product card titles on same page */
		font-size: 26px;
	}

	${from.desktop} {
		${headline.medium({
			fontWeight: 'bold',
		})};
		/* Overriding font-size to match the product card titles on same page */
		font-size: 36px;
	}
`;
const para = css`
	${body.medium()};
	line-height: 135%;
	margin-top: ${space[1]}px;
`;
const bold = css`
	font-weight: bold;
`;
const paraSecond = css`
	${body.medium()};
	line-height: 135%;
	margin: ${space[4]}px 0;

	${from.tablet} {
		margin-bottom: ${space[5]}px;
	}
`;
const paraTiny = css`
	display: inline-flex;
	order: 3;
	${textSans.xsmall()}
	margin: ${space[3]}px 0 ${space[2]}px;
	a,
	a:visited,
	a:hover {
		color: inherit;
	}

	${from.tablet} {
		margin: 0;
		position: absolute;
		bottom: 15px;
	}

	${from.desktop} {
		bottom: 55px;
	}

	${from.leftCol} {
		bottom: 60px;
	}

	${from.wide} {
		bottom: 80px;
	}
`;
const eventCardContainer = css`
	width: 100%;
	display: inline-flex;
	justify-content: space-between;
	section {
		width: 140px;
		max-width: 140px;
	}

	${from.mobileMedium} {
		justify-content: flex-start;
		section {
			width: 45%;
			min-width: 140px;
			max-width: 160px;
		}
		section + section {
			margin-left: ${space[5]}px;
		}
	}

	${from.tablet} {
		max-width: 47%;
		justify-content: flex-end;
		padding-right: ${space[3]}px;
		padding-top: ${space[6]}px;
	}

	${from.desktop} {
		max-width: 45%;
		padding-right: 0;
	}

	${from.leftCol} {
		max-width: 45%;
		padding-right: ${space[5]}px;
	}
`;
const countryId = detectCountry();
const FeaturedEventCardUK = (
	<EventCard
		eventType="Featured event"
		eventImage={keirStarmerImage}
		eventDate="20 Sept 2021"
		eventColour={news[400]}
		eventSectionText="Politics"
		eventDescription="Guardian Newsroom: Are the Labour Party electable?"
	/>
);
const FeaturedEventCardUS = (
	<EventCard
		eventType="Featured event"
		eventImage={woleSoyinkaImage}
		eventDate="28 Sept 2021"
		eventColour={culture[400]}
		eventSectionText="Culture"
		eventDescription="Wole Soyinka in conversation"
	/>
);
const featuredEvent =
	countryId === 'US' ? FeaturedEventCardUS : FeaturedEventCardUK;

function EventsModule() {
	return (
		<>
			<BlockLabel tag="h2" cssOverrides={label}>
				Special offer
			</BlockLabel>
			<section css={container}>
				<div css={contentContainer}>
					<div css={textContentContainer}>
						<SvgTicket />
						<h3 css={cardTitle}>
							Enjoy 6 free tickets to digital Guardian events
						</h3>
						<p css={para}>
							In the <span css={bold}>first 6 months</span> of your subscription
						</p>
						<p css={paraSecond}>
							Join interactive Live conversations with journalists, political
							leaders and cultural icons. Or get inspired to learn a new skill
							in selected Masterclasses. With events launching weekly and
							available on-demand.
						</p>
					</div>
					<div css={eventCardContainer}>
						{featuredEvent}
						<EventCard
							eventType="Featured masterclass"
							eventImage={felicityCloakeImage}
							eventDate="22 Sept 2021"
							eventColour={lifestyle[400]}
							eventSectionText="Lifestyle"
							eventDescription="How to write about food with Felicity Cloake"
						/>
					</div>
					<p css={paraTiny}>See full Terms &amp; Conditions below</p>
				</div>
			</section>
		</>
	);
}

export default EventsModule;
