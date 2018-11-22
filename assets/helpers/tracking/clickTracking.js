// @flow

// ----- Imports ----- //

import { type ComponentAbTest } from 'helpers/subscriptions';
import { gaEvent } from './googleTagManager';


// ----- Functions ----- //

function sendClickedEvent(
  label: string,
  triggerActivity?: string,
): () => void {

  return () => {
    gaEvent({
      category: 'click',
      action: triggerActivity || 'CLICK',
      label: label,
    });
  };

}

// ----- Exports ----- //

export {
  sendClickedEvent,
};
