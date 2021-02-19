
// @flow

// $FlowIgnore - required for hooks
import * as React from 'react';
import { AccordionRow } from '@guardian/src-accordion';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

type TabAccordionRowPropTypes = {|
  id: string,
  label: string,
  children: React.Node,
|};


export const TabAccordionRow = ({ id, label, children }: TabAccordionRowPropTypes) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  React.useEffect(() => {
    sendTrackingEventsOnClick({
      id: `paper_subscription_landing_page-tab-accordion-${id}_${expanded ? 'expand' : 'minimize'}`,
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
