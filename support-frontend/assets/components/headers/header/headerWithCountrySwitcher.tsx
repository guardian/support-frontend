// ----- Imports ----- //

import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import SupportRegionSwitcher from '../../supportRegionSwitcher/supportRegionSwitcher';
import Header from './header';

// ------ Component ----- //

export default function ({
	path,
	supportRegionId,
	listOfSupportRegions,
	trackProduct,
}: {
	path: string;
	supportRegionId: SupportRegionId;
	listOfSupportRegions: SupportRegionId[];
	trackProduct?: Option<SubscriptionProduct>;
	hideDigiSub?: boolean;
}) {
	return function (): JSX.Element {
		return (
			<Header
				supportRegionId={supportRegionId}
				utility={
					<SupportRegionSwitcher
						supportRegionIds={listOfSupportRegions}
						selectedSupportRegion={supportRegionId}
						subPath={path}
						trackProduct={trackProduct}
					/>
				}
			/>
		);
	};
}
