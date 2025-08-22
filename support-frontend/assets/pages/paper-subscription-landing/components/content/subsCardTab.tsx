// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSans15,
	until,
} from '@guardian/source/foundations';
import { Accordion } from '@guardian/source/react-components';
import FlexContainer from 'components/containers/flexContainer';
import GridImage from 'components/gridImage/gridImage';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { TabAccordionRow } from './tabAccordionRow';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;

	img {
		${until.leftCol} {
			display: none;
		}
	}
`;
const faqsContainer = css`
	${from.leftCol} {
		max-width: 50%;
	}
`;
const paragraphSpacing = css`
	margin-bottom: ${space[6]}px;
	${until.tablet} {
		padding: 0 ${space[2]}px;
	}
`;
const accordionContainer = css`
	background-color: ${neutral['97']};

	p,
	a {
		${textSans15};
		margin-bottom: ${space[3]}px;
	}

	p,
	button {
		padding-right: ${space[2]}px;
		padding-left: ${space[2]}px;
	}
`;

// ----- Content ----- //
function LinkToInfo({
	trackingId,
	url,
	copy,
}: {
	trackingId: string;
	url: string;
	copy: string;
}) {
	const trackClick = sendTrackingEventsOnClick({
		id: `${trackingId}_retailer-link`,
		product: 'Paper',
		componentType: 'ACQUISITIONS_OTHER',
	});
	return (
		<a
			onClick={trackClick}
			href={url}
			target="_blank"
			rel="noopener noreferrer"
		>
			{copy}
		</a>
	);
}

const collectonAccordionTrackingId =
	'Paper_Collection-tab_Collection-accordion';
const deliveryAccordionTrackingId = 'Paper_Collection-tab_Delivery-accordion';
export function SubsCardFaqBlock() {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div css={faqsContainer}>
				<p css={paragraphSpacing}>
					Use your Guardian subscription card to pick up your paper in over
					40,000 UK shops with news kiosks, including Co-op, McColl&apos;s, One
					Stop, and select SPAR stores. Or use your card to arrange your own
					delivery through a local newsagent.
				</p>
				<div css={accordionContainer}>
					<Accordion>
						<TabAccordionRow
							trackingId={collectonAccordionTrackingId}
							label="How to collect in store"
						>
							<>
								<p>
									To pick up your paper from multiple newsagents, present your
									Guardian subscription card each time &mdash; they&apos;ll scan
									it and be reimbursed automatically.
								</p>
								<p>
									<LinkToInfo
										trackingId={collectonAccordionTrackingId}
										url="https://digitalvouchers-production-storefinder.azurewebsites.net/map/go"
										copy="Find your nearest participating retailer"
									/>
								</p>
							</>
						</TabAccordionRow>
						<TabAccordionRow
							trackingId={deliveryAccordionTrackingId}
							label="How to arrange your own delivery"
						>
							<>
								<p>
									If you prefer to arrange your own delivery with your local
									retailer, simply share the barcode from your Home Delivery
									Letter with your chosen newsagent. You will receive your Home
									Delivery Letter along with your Guardian subscription card.
								</p>
							</>
						</TabAccordionRow>
					</Accordion>
				</div>
			</div>
			<GridImage
				gridId="printCampaignDigitalVoucher"
				srcSizes={[500, 140]}
				sizes="(max-width: 740px) 100vw, 500px"
				imgType="png"
			/>
		</FlexContainer>
	);
}
