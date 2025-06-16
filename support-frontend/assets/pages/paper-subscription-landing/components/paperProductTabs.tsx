import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { ReactElement } from 'react';
import { useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import ProductCard from 'components/product/PaperProductCard';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPlans } from '../helpers/getPlans';
import { PaperTabHero } from './content/paperTabHero';

const cardsContainer = css`
	background-color: ${palette.brand[400]};
	padding: ${space[6]}px ${space[5]}px ${space[3]}px;
	gap: ${space[4]}px;
	display: flex;
	flex-direction: column;
	${from.tablet} {
		flex-direction: row;
		padding: ${space[3]}px ${space[6]}px ${space[5]}px;
		gap: ${space[5]}px;
	}
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
					{products.map((product) => (
						<ProductCard
							title={product.title}
							price={product.price}
							planData={product.planData}
							offerCopy={product.offerCopy}
							buttonCopy={product.buttonCopy}
							href={product.href}
							onClick={product.onClick}
							onView={product.onView}
							label={product.label}
							productLabel={product.productLabel}
							unavailableOutsideLondon={product.unavailableOutsideLondon}
						/>
					))}
				</section>
			</CentredContainer>
		</FullWidthContainer>
	);
}

export default PaperProductTabs;
