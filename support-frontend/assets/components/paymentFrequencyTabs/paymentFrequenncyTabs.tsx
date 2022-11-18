import { css } from '@emotion/react';
import { focus } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentFrequencyTabButtonAttributes } from './paymentFrequencyTabButton';
import { PaymentFrequencyTabButton } from './paymentFrequencyTabButton';

const tabListStyles = css`
	display: flex;
`;

const tabPanelStyles = css`
	/* .src-focus-disabled is added by the Source FocusStyleManager */
	html:not(.src-focus-disabled) &:focus {
		outline: 5px solid ${focus[400]};
		outline-offset: -5px;
	}
`;

export type TabProps = {
	id: ContributionType;
	labelText: string;
	selected: boolean;
};

export type PaymentFrequencyTabsRenderProps = {
	ariaLabel: string;
	tabs: TabProps[];
	selectedTab: ContributionType;
	onTabChange: (tabId: ContributionType) => void;
};

export type PaymentFrequencyTabsProps = PaymentFrequencyTabsRenderProps & {
	renderTabContent: (tabId: ContributionType) => ReactNode;
	TabController?: typeof PaymentFrequencyTabButton;
};

function getTabPanelId(tabId: string) {
	return `${tabId}-tab`;
}

function getTabControllerAttributes(
	tab: TabProps,
): PaymentFrequencyTabButtonAttributes {
	return {
		role: 'tab',
		id: tab.id,
		ariaSelected: tab.selected ? 'true' : 'false',
		ariaControls: getTabPanelId(tab.id),
	};
}

export function PaymentFrequencyTabs({
	ariaLabel,
	tabs,
	selectedTab,
	onTabChange,
	renderTabContent,
	TabController = PaymentFrequencyTabButton,
}: PaymentFrequencyTabsProps): JSX.Element {
	const isInitialMount = useRef(true);
	const tabPanel = useRef<HTMLDivElement>(null);

	// We want to auto-focus the tab panel when the tab selection changes, but not on initial mount
	// Cf. https://reactjs.org/docs/hooks-faq.html#can-i-run-an-effect-only-on-updates
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			tabPanel.current?.focus();
		}
	}, [selectedTab]);

	return (
		<div>
			<div role="tablist" aria-label={ariaLabel} css={tabListStyles}>
				{tabs.map((tab: TabProps) => {
					return (
						<TabController
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							{...getTabControllerAttributes(tab)}
						>
							{tab.labelText}
						</TabController>
					);
				})}
			</div>
			<div
				ref={tabPanel}
				css={tabPanelStyles}
				role="tabpanel"
				id={getTabPanelId(selectedTab)}
				aria-labelledby={selectedTab}
				tabIndex={-1}
			>
				{renderTabContent(selectedTab)}
			</div>
		</div>
	);
}
