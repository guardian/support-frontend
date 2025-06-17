import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import type { ReactElement } from 'react';
import { useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Carousel from 'components/product/Carousel';
import ProductCard from 'components/product/PaperProductCard';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import { useIsWideScreen } from 'helpers/customHooks/useIsWideScreen';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPlans } from '../helpers/getPlans';
import { PaperTabHero } from './content/paperTabHero';

const cardsContainer = css`
	background-color: ${palette.brand[400]};
	padding: 0 ${space[6]}px ${space[6]}px;
	gap: ${space[4]}px;
	display: flex;
	flex-direction: column;
`;

type TabOptions = {
	text: string;
	href: string;
	content: () => ReactElement;
};

const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	HomeDelivery: {
		text: 'Home Delivery',
		href: `#${HomeDelivery}`,
		content: () => <PaperTabHero tab={HomeDelivery} />,
	},
	Collection: {
		text: 'Subscription Card',
		href: `#${Collection}`,
		content: () => <PaperTabHero tab={Collection} />,
	},
};

function PaperProductTabs({ productPrices }: { productPrices: ProductPrices }) {
	const fulfilment =
		window.location.hash === `#${Collection}` ? Collection : HomeDelivery;

	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(fulfilment);
	const isWideScreen = useIsWideScreen();

	const products = getPlans(selectedTab, productPrices);

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
		products.map((product) => <ProductCard {...product} />);

	return (
		<FullWidthContainer>
			<CentredContainer>
				<Tabs
					tabsLabel="Paper subscription options"
					tabElement="a"
					tabs={tabItems}
					onTabChange={(tabId) => {
						setSelectedTab(tabId);
					}}
					theme="paperTabs"
				/>
				<section css={cardsContainer}>
					{isWideScreen ? (
						<Carousel items={renderProducts()} />
					) : (
						renderProducts()
					)}
				</section>
			</CentredContainer>
		</FullWidthContainer>
	);
}

export default PaperProductTabs;
