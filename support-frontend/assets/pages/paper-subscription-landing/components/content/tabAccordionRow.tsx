import type { SerializedStyles } from '@emotion/utils';
import { AccordionRow } from '@guardian/source/react-components';
import { useEffect, useRef, useState } from 'react';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

type TabAccordionRowPropTypes = {
	trackingId: string;
	label: string;
	children: React.ReactNode;
	cssOverrides?: SerializedStyles;
};
export function TabAccordionRow({
	trackingId,
	label,
	children,
	cssOverrides,
}: TabAccordionRowPropTypes): JSX.Element {
	const initialRender = useRef(true);
	const [expanded, setExpanded] = useState<boolean>(false);
	useEffect(() => {
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
			cssOverrides={cssOverrides}
			onClick={() => {
				setExpanded(!expanded);
			}}
		>
			{children}
		</AccordionRow>
	);
}
