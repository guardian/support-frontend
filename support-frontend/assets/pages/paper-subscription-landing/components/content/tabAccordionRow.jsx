
// @flow

// $FlowIgnore - required for hooks
import * as React from 'react';
import { AccordionRow } from '@guardian/src-accordion';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

type TabAccordionRowPropTypes = {|
  trackingId: string,
  label: string,
  children: React.Node,
|};


export const TabAccordionRow = ({
  trackingId, label, children,
}: TabAccordionRowPropTypes) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  React.useEffect(() => {
    sendTrackingEventsOnClick({
      id: `${trackingId}-${expanded ? 'expand' : 'minimize'}`,
      product: 'Paper',
      componentType: 'ACQUISITIONS_BUTTON',
    })();
  }, [expanded]);

  return (
    <AccordionRow
      label={label}
      onClick={() => {
      setExpanded(!expanded);
}}
    >
      { children }
    </AccordionRow>
  );
};
