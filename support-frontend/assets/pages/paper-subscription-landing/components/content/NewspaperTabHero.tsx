import { Accordion } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import FlexContainer from 'components/containers/flexContainer';
import GridImage from 'components/gridImage/gridImage';
import { getHeroContent } from 'pages/paper-subscription-landing/helpers/newsPaperTabHeroData';
import {
	accordionOverride,
	accordionRowOverride,
	copyWidthStyle,
	flexContainerOverride,
	paragraphStyle,
} from './NewspaperTabHeroStyles';
import { TabAccordionRow } from './tabAccordionRow';

export default function NewspaperTabHero({
	tab,
}: {
	tab: PaperFulfilmentOptions;
}): JSX.Element {
	const homeDeliveryTrackingId = 'Paper_HomeDelivery-tab_Delivery-accordion';
	const { productInfo, deliveries } = getHeroContent(tab);
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div css={copyWidthStyle}>
				<p css={paragraphStyle}>{productInfo}</p>
				{deliveries.map((delivery) => (
					<Accordion cssOverrides={accordionOverride}>
						{[
							<TabAccordionRow
								trackingId={homeDeliveryTrackingId}
								label={delivery.deliveryTitle}
								cssOverrides={accordionRowOverride}
							>
								{delivery.deliveryInfo}
							</TabAccordionRow>,
						]}
					</Accordion>
				))}
			</div>
			<GridImage
				gridId={`paperLandingTab${tab}`}
				srcSizes={[1000, 500]}
				sizes="(max-width: 375px) 300px, (min-width: 375px) 353px"
				imgType="png"
				altText="Illustration of The Guardian subscription card"
			/>
		</FlexContainer>
	);
}
