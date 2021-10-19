// ----- Imports ----- //
import { css } from '@emotion/core';
import { Accordion } from '@guardian/src-accordion';
import { space } from '@guardian/src-foundations';
import { from, until } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import React from 'react';
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
export const accordionContainer = css`
	background-color: ${neutral['97']};

	p,
	a {
		${textSans.small()};
		margin-bottom: ${space[3]}px;
	}

	p,
	button {
		padding-right: ${space[2]}px;
		padding-left: ${space[2]}px;
	}
`;

// ----- Content ----- //
const LinkToInfo = ({
	trackingId,
	url,
	copy,
}: {
	trackingId: string;
	url: string;
	copy: string;
}) => {
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
};

const collectonAccordionTrackingId =
	'Paper_Collection-tab_Collection-accordion';
const deliveryAccordionTrackingId = 'Paper_Collection-tab_Delivery-accordion';
export const SubsCardFaqBlock = () => (
	<FlexContainer cssOverrides={flexContainerOverride}>
		<div css={faqsContainer}>
			<p css={paragraphSpacing}>
				The Guardian subscription card can be used at any of the 40,000 shops
				and supermarkets with news kiosks in the UK such as McColl&apos;s,
				Co-op, One Stop and selected SPAR stores.
			</p>
			<p css={paragraphSpacing}>
				You can collect the newspaper from your local store or have your copies
				delivered by your newsagent.
			</p>
			<div css={accordionContainer}>
				<Accordion>
					<TabAccordionRow
						trackingId={collectonAccordionTrackingId}
						label="Collecting from multiple newsagents"
					>
						<>
							<p>
								Present your card to a newsagent each time you collect the
								newspaper. The newsagent will scan your card and will be
								reimbursed for each transaction automatically.
							</p>
							<p>
								<LinkToInfo
									trackingId={collectonAccordionTrackingId}
									url="https://imovo.org/guardianstorefinder"
									copy="Find your nearest participating retailer"
								/>
							</p>
						</>
					</TabAccordionRow>
					<TabAccordionRow
						trackingId={deliveryAccordionTrackingId}
						label="Delivery from your retailer"
					>
						<>
							<p>
								Simply give your preferred store / retailer the barcode printed
								on your Home Delivery Letter.
							</p>
							<p>
								<LinkToInfo
									trackingId={deliveryAccordionTrackingId}
									url="https://www.delivermynewspaper.co.uk"
									copy="Find your nearest delivery retailer"
								/>
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
