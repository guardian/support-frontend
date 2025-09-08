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
	imageHeightStyle,
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
			<div css={imageHeightStyle}>
				<GridImage
					gridId={'guardianWeeklyTabHero'}
					srcSizes={[1000, 500]}
					sizes="(max-width: 1139px) 244px, (min-width: 1140px) 300px"
					imgType="png"
					altText="Guardian Weekly Tab Hero"
				/>
			</div>
		</FlexContainer>
	);
}
