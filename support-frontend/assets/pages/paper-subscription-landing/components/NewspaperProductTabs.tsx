import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Carousel from 'components/product/Carousel';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import NewspaperRatePlanCard from 'pages/paper-subscription-landing/components/NewspaperRatePlanCard';
import { getPlans } from '../helpers/getPlans';
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
	productCatalog,
	promotions,
	promoCode,
	fulfilment,
}: {
	productCatalog: WindowProductCatalog;
	promotions: PromoWithCatalogInformation[];
	promoCode?: string;
	fulfilment?: PaperFulfilmentOptions;
}) {
	const paperFulfilment =
		fulfilment ??
		(window.location.hash === `#${HomeDelivery}` ? HomeDelivery : Collection);
	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(paperFulfilment);

	const { windowWidthIsGreaterThan } = useWindowWidth();
	const { setPromoTerms } = usePromoTerms();

	const productRatePlans = useMemo(
		() =>
			getPlans({
				fulfilmentOption: selectedTab,
				productCatalog,
				promotions,
				promoCode,
			}),
		[selectedTab],
	);

	const handleTabChange = (tabId: PaperFulfilmentOptions) => {
		setSelectedTab(tabId);
		sendTrackingEventsOnClick({
			id: `Paper_${tabId}-tab`,
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})();
		windowSetHashProperty(tabId);
		// clean promo terms when switching tabs, as they are specific to each tab's offers
		setPromoTerms(null);
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
				<PaperLandingTsAndCs paperFulfilment={selectedTab} />
			</CentredContainer>
		</FullWidthContainer>
	);
}

export default NewspaperProductTabs;
