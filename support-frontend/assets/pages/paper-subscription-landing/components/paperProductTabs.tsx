// ----- Imports ----- //
import { Outset } from 'components/content/content';
import Tabs from 'components/tabs/tabs';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { PaperDeliveryTab } from './content/paperDeliveryTab';
import { PaperSubsCardTab } from './content/paperSubsCardTab';
// ----- Tabs ----- //
type TabOptions = {
	name: string;
	href: string;
	content: typeof PaperDeliveryTab | typeof PaperSubsCardTab;
};
const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	HomeDelivery: {
		name: 'Home Delivery',
		href: `#${HomeDelivery}`,
		content: PaperDeliveryTab,
	},
	Collection: {
		name: 'Subscription Card',
		href: `#${Collection}`,
		content: PaperSubsCardTab,
	},
};
type PaperProductTabsProps = {
	selectedTab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	productPrices?: ProductPrices;
};

// ----- Component ----- //
function PaperProductTabs({
	selectedTab,
	setTabAction,
}: PaperProductTabsProps): JSX.Element {
	const tabOptions = Object.keys(tabs);
	const tabItems = (tabOptions as PaperFulfilmentOptions[]).map(
		(fulfilmentMethod) => {
			const TabContent = tabs[fulfilmentMethod].content;
			return {
				id: fulfilmentMethod,
				text: tabs[fulfilmentMethod].name,
				href: tabs[fulfilmentMethod].href,
				selected: fulfilmentMethod === selectedTab,
				content: <TabContent />,
			};
		},
	);
	return (
		<Outset>
			<Tabs
				tabsLabel="Paper subscription options"
				tabElement="a"
				tabs={tabItems}
				onTabChange={(tabId) => {
					const newActiveTab = tabId as PaperFulfilmentOptions;
					setTabAction(newActiveTab);
				}}
			/>
		</Outset>
	);
} // ----- Exports ----- //

export default PaperProductTabs;
