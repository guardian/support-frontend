// @ts-expect-error - required for hooks
import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	headline,
	neutral,
	space,
} from '@guardian/source-foundations';
import {
	Accordion,
	AccordionRow,
	Checkbox,
} from '@guardian/source-react-components';
import * as React from 'react';
import GridImage from 'components/gridImage/gridImage';
import { ListWithSubText } from 'components/list/list';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

type PropTypes = {
	digiSubPrice: string;
	addDigitalSubscription: (
		event: React.SyntheticEvent<HTMLInputElement>,
	) => void;
};
const rowOverrides = css`
	border: none;
	& > div {
		max-height: 1000px;
	}

	& button strong {
		${headline.xsmall({
			fontWeight: 'bold',
		})}
	}
`;
const ctaContainer = css`
	background-color: ${brandAlt[400]};
	padding: 0 ${space[6]}px;
	border-top: 1px solid ${neutral[86]};
	border-bottom: 1px solid ${neutral[86]};
	transition: background-color 0.2s ease-out;
`;
const ctaContainerOpen = css`
	background-color: ${neutral[97]};
`;
const lightBorder = css`
	border-bottom: 1px solid ${neutral[86]};
`;
const imageContainer = css`
	display: flex;
	justify-content: center;
`;
const heading = css`
	${headline.xsmall({
		fontWeight: 'bold',
	})}
	margin-bottom: ${space[3]}px;
`;
const content = css`
	padding: ${space[6]}px 0;
`;
const list = css`
	margin-bottom: 0;
	${from.desktop} {
		margin-bottom: 0;
	}
`;
const listCopy = [
	{
		content: 'The Guardian Editions app',
		subText: `Each edition available to read by 6am (GMT), 7 days a week for
    iOS and Android mobile and tablet. Download and read whenever it suits you.`,
	},
	{
		content: 'Premium access to the Guardian Live app',
		subText:
			'Live feed, Discover and daily crosswords. Download the news whenever it suits you.',
	},
	{
		content: 'Ad-free',
		subText: 'Enjoy our journalism uninterrupted, without adverts.',
	},
];

function AddDigiSubCta({ addDigitalSubscription, digiSubPrice }: PropTypes) {
	const initialRender = React.useRef(true);
	const [expanded, setExpanded] = React.useState<boolean>(false);
	React.useEffect(() => {
		// don't call sendTrackingEventsOnClick on initialRender
		if (initialRender.current) {
			initialRender.current = false;
		} else {
			sendTrackingEventsOnClick({
				id: `Paper_Checkout_DigiPlus_Accordion-${
					expanded ? 'expand' : 'minimize'
				}`,
				product: 'Paper',
				componentType: 'ACQUISITIONS_OTHER',
			})();
		}
	}, [expanded]);
	return (
		<Accordion
			cssOverrides={[ctaContainer, expanded ? ctaContainerOpen : '']}
			hideToggleLabel
		>
			<AccordionRow
				cssOverrides={rowOverrides}
				label={`Would you like to add a digital subscription for ${digiSubPrice}?`}
				onClick={() => {
					setExpanded(!expanded);
				}}
			>
				<div css={[imageContainer, lightBorder]}>
					<GridImage
						gridId="editionsShortPackshot"
						srcSizes={[500, 140]}
						sizes="(max-width: 480px) 200px,
            (max-width: 740px) 100%,
            500px"
						altText="Digital subscriptions"
						imgType="png"
					/>
				</div>
				<div css={[content, lightBorder]}>
					<h2 css={heading}>What&apos;s included</h2>
					<ListWithSubText
						cssOverrides={list}
						items={listCopy}
						bulletSize="small"
						bulletColour="dark"
					/>
				</div>
				<div css={content}>
					<Checkbox
						value="add-digital"
						label={`Add the digital subscription for ${digiSubPrice}`}
						onChange={addDigitalSubscription}
					/>
				</div>
			</AccordionRow>
		</Accordion>
	);
}

export default AddDigiSubCta;
