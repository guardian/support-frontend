// @ts-ignore - required for hooks
import * as React from 'react';
import { AccordionRow } from '@guardian/src-accordion';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
type TabAccordionRowPropTypes = {
	trackingId: string;
	label: string;
	children: React.ReactNode;
};
export const TabAccordionRow = ({
	trackingId,
	label,
	children,
}: TabAccordionRowPropTypes) => {
	const initialRender = React.useRef(true);
	const [expanded, setExpanded] = React.useState<boolean>(false);
	React.useEffect(() => {
		// don't call sendTrackingEventsOnClick on initialRender
		if (initialRender.current) {
			initialRender.current = false;
		} else {
			sendTrackingEventsOnClick({
				id: `${trackingId}-${expanded ? 'expand' : 'minimize'}`,
				product: 'Paper',
				componentType: 'ACQUISITIONS_BUTTON',
			})();
		}
	}, [expanded]);
	return (
		<AccordionRow
			label={label}
			onClick={() => {
				setExpanded(!expanded);
			}}
		>
			{children}
		</AccordionRow>
	);
};
