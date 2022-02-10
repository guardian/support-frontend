import type { ReactNode } from 'react';
import { tabButton, tabList, tabPanel } from './tabsStyles';

type TabElement = 'a' | 'button';
type TabProps = {
	id: string;
	text: string;
	href?: string;
	selected: boolean;
	content: ReactNode;
};
type PropTypes = {
	tabsLabel: string;
	tabElement: TabElement;
	tabs: TabProps[];
	onTabChange: (tabName: string) => void;
};

function Tabs({
	tabsLabel,
	tabElement,
	tabs,
	onTabChange,
}: PropTypes): JSX.Element {
	const TabControllerElement = tabElement;
	return (
		<div>
			<div css={tabList} role="tablist" aria-label={tabsLabel}>
				{tabs.map((tab: TabProps) => {
					const selected = tab.selected ? 'true' : 'false';
					return (
						<TabControllerElement
							css={tabButton}
							role="tab"
							id={tab.id}
							href={tab.href}
							aria-selected={selected}
							aria-controls={`${tab.id}-tab`}
							onClick={(event) => {
								event.preventDefault();
								onTabChange(tab.id);
							}}
						>
							{tab.text}
						</TabControllerElement>
					);
				})}
			</div>
			{tabs.map((tab: TabProps) => (
				<div
					css={tabPanel}
					role="tabpanel"
					id={`${tab.id}-tab`}
					aria-labelledby={tab.id}
					hidden={!tab.selected}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}

export default Tabs;
