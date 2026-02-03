import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Carousel from 'components/product/Carousel';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import { ActivePaperProductTypes } from 'helpers/productCatalogToProductOption';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import NewspaperRatePlanCard from 'pages/paper-subscription-landing/components/NewspaperRatePlanCard';
import { getPlans } from '../helpers/getPlans';
import getPaperPromotions from '../helpers/getPromotions';
import { windowSetHashProperty } from '../helpers/windowSetHashProperty';
import NewspaperTabHero from './content/NewspaperTabHero';
import { cardsContainer } from './NewspapperProductTabsStyles';
import PaperLandingTsAndCs from './PaperLandingTsAndCs';

type TabOptions = {
	text: string;
	href: string;
	content: () => ReactElement;
};

const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	Collection: {
		text: 'Collect in store',
		href: `#${Collection}`,
		content: () => <NewspaperTabHero tab={Collection} />,
	},
	HomeDelivery: {
		text: 'Home delivery',
		href: `#${HomeDelivery}`,
		content: () => <NewspaperTabHero tab={HomeDelivery} />,
	},
};

function NewspaperProductTabs({
	productPrices,
	fulfilment,
}: {
	productPrices: ProductPrices;
	fulfilment?: PaperFulfilmentOptions;
}) {
	const paperFulfilment =
		fulfilment ??
		(window.location.hash === `#${HomeDelivery}` ? HomeDelivery : Collection);
	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(paperFulfilment);

	const { windowWidthIsGreaterThan } = useWindowWidth();

	const promotions = useMemo(
		() =>
			getPaperPromotions({
				activePaperProductTypes: ActivePaperProductTypes,
				productPrices,
				paperFulfilment: selectedTab,
			}),
		[selectedTab],
	);

	const productRatePlans = useMemo(
		() =>
			getPlans(selectedTab, productPrices, ActivePaperProductTypes, promotions),
		[selectedTab, promotions],
	);

	const handleTabChange = (tabId: PaperFulfilmentOptions) => {
		setSelectedTab(tabId);
		sendTrackingEventsOnClick({
			id: `Paper_${tabId}-tab`,
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})();
		windowSetHashProperty(tabId);
	};

	const tabItems = Object.entries(tabs).map(([fulfilment, tab]) => {
		const { href, text, content: ContentComponent } = tab;
		return {
			id: fulfilment,
			text,
			href,
			selected: fulfilment === selectedTab,
			content: <ContentComponent />,
		} as TabProps;
	});

	const renderProducts = () =>
		productRatePlans.map((product) => <NewspaperRatePlanCard {...product} />);

	return (
		<FullWidthContainer>
			<CentredContainer>
				<Tabs
					tabsLabel="Paper subscription options"
					tabElement="a"
					tabs={tabItems}
					onTabChange={handleTabChange}
					theme="paperTabs"
				/>
				<section css={cardsContainer}>
					{windowWidthIsGreaterThan('tablet') ? (
						<Carousel items={renderProducts()} />
					) : (
						renderProducts()
					)}
				</section>
				<PaperLandingTsAndCs
					paperFulfilment={selectedTab}
					productPrices={productPrices}
					activePaperProducts={ActivePaperProductTypes}
					paperPromotions={promotions}
				/>
			</CentredContainer>
		</FullWidthContainer>
	);
}

export default NewspaperProductTabs;
